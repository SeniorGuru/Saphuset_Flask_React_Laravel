import os
import logging
import traceback
import werkzeug
from flask import Flask, request
from werkzeug import Request, Response
from sqlalchemy import create_engine
from surt.Module.subModuleMapper import Mapper as sapConfigMapper
from surt.Setting.SettingMapper import SettingMapper as settingMapper
from surt.SystemMonitor.Mapper import Mapper as systemMonitorMapper
from sqlalchemy.orm import sessionmaker
from surt.Utils.sessionUtils import session_scope, getDatabaseEngine
from environs import Env

env = Env()
env.read_env()

logLocation = env("LOG_LOCATION")

# logging.basicConfig(filename=logLocation,level=logging.DEBUG)

user = env("DB_USER")
password = env("DB_PASSWORD")
ip = env("DB_HOST")
port = env("DB_PORT")
connectionPool = {}
enginePool = {}

app = Flask(__name__)


class Middleware:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, response):
        req = Request(environ)
        if 'tenant' not in req.headers:
            res = Response('header tenant missing', status=500)
            return res(environ, response)

        tenant = req.headers['tenant']
        environ['logger'] = app.logger

        tenantDatabaseEngine = getDatabaseEngine(tenant)
        with session_scope(tenantDatabaseEngine) as tenantConn:
            environ['connection'] = tenantConn

        tenancyDatabaseEngine = getDatabaseEngine("tenancy")
        with session_scope(tenancyDatabaseEngine) as tenancyConn:
            environ['tenancyConnection'] = tenancyConn

        return self.app(environ, response)


@app.route("/api/<module>/<submodule>/<name>", methods=["GET", "POST"])
def apiMapper(module, submodule, name):
    if module == 'Module':
        return sapConfigMapper().call(submodule=submodule, name=name)
    if module == 'Setting':
        return settingMapper().call(submodule=submodule, name=name)
    if module == 'SystemMonitor':
        return systemMonitorMapper().call(submodule=submodule, name=name)

def internal_error(exception):
    print("500 error caught")
    print(traceback.format_exc())


app.register_error_handler(500, internal_error)
app.wsgi_app = Middleware(app.wsgi_app)

if __name__ == "__main__":
    app.run()
