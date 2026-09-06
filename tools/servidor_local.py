"""Servidor estático com suporte a HTTP Range.

O http.server padrão do Python responde sempre 200 com o arquivo inteiro, e sem
Range o navegador reporta seekable=[0,0] — o que quebra qualquer teste de seek
em vídeo. GitHub Pages e qualquer servidor real suportam Range; este só existe
para o teste local ficar fiel.
"""
import os
import re
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class RangeHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        faixa = self.headers.get('Range')
        if not faixa:
            return super().send_head()

        caminho = self.translate_path(self.path)
        if os.path.isdir(caminho):
            return super().send_head()

        try:
            f = open(caminho, 'rb')
        except OSError:
            self.send_error(404)
            return None

        tamanho = os.fstat(f.fileno()).st_size
        m = re.match(r'bytes=(\d*)-(\d*)', faixa)
        if not m:
            f.close()
            self.send_error(400)
            return None

        ini = int(m.group(1)) if m.group(1) else 0
        fim = int(m.group(2)) if m.group(2) else tamanho - 1
        fim = min(fim, tamanho - 1)

        if ini > fim:
            f.close()
            self.send_error(416)
            return None

        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(caminho))
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Content-Range', f'bytes {ini}-{fim}/{tamanho}')
        self.send_header('Content-Length', str(fim - ini + 1))
        self.end_headers()

        f.seek(ini)
        return _Trecho(f, fim - ini + 1)

    def end_headers(self):
        if 'Accept-Ranges' not in self._headers_buffer_str():
            self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def _headers_buffer_str(self):
        return b''.join(self._headers_buffer or []).decode('latin-1')


class _Trecho:
    """Arquivo limitado a N bytes, para o copyfile parar no fim da faixa."""

    def __init__(self, arquivo, restante):
        self.arquivo = arquivo
        self.restante = restante

    def read(self, n=-1):
        if self.restante <= 0:
            return b''
        if n < 0 or n > self.restante:
            n = self.restante
        dados = self.arquivo.read(n)
        self.restante -= len(dados)
        return dados

    def close(self):
        self.arquivo.close()


if __name__ == '__main__':
    porta = int(sys.argv[1])
    raiz = sys.argv[2]
    os.chdir(raiz)
    ThreadingHTTPServer(('127.0.0.1', porta), RangeHandler).serve_forever()
