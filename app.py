from app import create_app

app = create_app()

if __name__ == '__main__':
    host = app.config.get('FLASK_RUN_HOST', '127.0.0.1')
    port = app.config.get('FLASK_RUN_PORT', 20000)
    debug = app.config.get('FLASK_DEBUG', True)
    app.run(host=host, port=port, debug=debug) 