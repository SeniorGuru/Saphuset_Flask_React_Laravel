import json
from flask import request
from sqlalchemy.sql import func
from surt.Utils.logger import Logger
from surt.Models.m_groups import mGroups
from surt.Models.m_instance_grouper import mInstanceGrouper
from surt.Models.m_instance import mInstance
from surt.Models.m_clients import mClients
from surt.Utils.response import Response
from surt.Models.m_teams import mTeams
from surt.Models.users import Users
from surt.Models.m_functional_area import mFunctionalArea
from datetime import datetime


class Team:

    def __init__(self):
        # Tenant Database connection instance
        self.connection = request.environ['connection']
        # Tenancy Database connection instance
        self.tenancyConnection = request.environ['tenancyConnection']
        # Post Data
        self.oData = request.get_json().get("data")
        # Logged in User Data
        self.user = request.get_json()['user']
        # Logger Instance
        self.logger = Logger()

    def getAllTeam(self):
        try:
            response = {"team_list": []}
            # Sample to access Databse table
            teams = self.connection.query(mTeams).filter().all()
            for team in teams:
                team_list = {}
                team_list['functions'] = []
                team_list['team_name'] = team.name
                team_list['team_id'] = team.id
                team_list['team_description'] = team.description
                team_lead = self.tenancyConnection.query(Users).filter(Users.team_id == team.id,
                                                                       Users.tenant_id == self.user.get("tenant_id"),
                                                                       Users.user_type == 1).first()
                if team_lead is None:
                    team_list['lead_name'] = ''
                    team_list['lead_avatar'] = ''
                    team_list['lead_id'] = 0
                else:
                    team_list['lead_name'] = team_lead.name
                    team_list['lead_avatar'] = team_lead.photo
                    team_list['lead_id'] = team_lead.id
                selGroup = self.connection.query(mFunctionalArea).filter(mFunctionalArea.team_id == team.id).all()
                for sel in selGroup:
                    team_list['functions'].append(sel.id)
                response["team_list"].append(team_list)
            return Response(200, message=response).send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def getAllFunction(self):
        try:

            response = {"function_list": []}
            # Sample to access Databse table
            functions = self.connection.query(mFunctionalArea).filter().all()
            for function in functions:
                function_list = {}
                function_list['function_name'] = function.name
                function_list['team_id'] = function.team_id
                function_list['function_id'] = function.id
                function_list['color_code'] = function.color_code
                function_list['description'] = function.description
                response["function_list"].append(function_list)
            return Response(200, message=response).send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def getLeadUsers(self):

        try:
            response = {"user_list": []}
            # Sample to access Databse table
            users = self.tenancyConnection.query(Users).filter(Users.tenant_id == self.user.get("tenant_id"),
                                                               Users.user_type == 1, Users.team_id == 0).all()
            for user in users:
                user_list = {}
                user_list['id'] = user.id
                user_list['name'] = user.name
                response["user_list"].append(user_list)
            return Response(200, message=response).send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def addTeam(self):
        try:
            team = mTeams(name=self.oData["team_name"], description=self.oData["team_description"])
            self.connection.add(team)
            self.connection.commit()
            users = self.tenancyConnection.query(Users).filter(Users.tenant_id == self.user.get("tenant_id"),
                                                               Users.user_type == 1,
                                                               Users.id == self.oData["lead_id"]).first()
            print("hello")
            print(users.id)
            print(team.id)
            users.team_id = team.id
            self.tenancyConnection.commit()
            functions = self.oData["functionArea"]
            for function in functions:
                f_data = mFunctionalArea(team_id=team.id, name=function["name"], description=function["description"],
                                         color_code=function["color_code"])
                self.connection.add(f_data)
                self.connection.commit()
            return Response(200, message="success").send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def editTeam(self):
        try:
            team = self.connection.query(mTeams).filter(
                mTeams.id == self.oData["team_id"]).first()
            team.name = self.oData["team_name"]
            team.description = self.oData["team_description"]
            self.connection.commit()
            users = self.tenancyConnection.query(Users).filter(Users.tenant_id == self.user.get("tenant_id"),
                                                               Users.user_type == 1,
                                                               Users.team_id == self.oData["team_id"]).first()
            if users is not None:
                users.team_id = 0
                self.tenancyConnection.commit()
            users = self.tenancyConnection.query(Users).filter(Users.tenant_id == self.user.get("tenant_id"),
                                                               Users.user_type == 1,
                                                               Users.id == self.oData["lead_id"]).first()
            users.team_id = self.oData["team_id"]
            self.tenancyConnection.commit()
            areas = self.connection.query(mFunctionalArea).filter(
                mFunctionalArea.team_id == self.oData["team_id"]).all()
            functions = self.oData["functionArea"]
            for area in areas:
                flg = False
                for fun in functions:
                    if area.id == fun["id"]:
                        flg = True
                if flg is False:
                    self.connection.query(mFunctionalArea).filter(mFunctionalArea.id == area.id).delete()
            for function in functions:
                if function["id"] == -1:
                    functionarea = mFunctionalArea(team_id=self.oData["team_id"], name=function["name"],
                                                   description=function["description"],
                                                   color_code=function["color_code"])
                    self.connection.add(functionarea)
                    self.connection.commit()
                else:
                    functionarea = self.connection.query(mFunctionalArea).filter(
                        mFunctionalArea.id == function["id"]).first()
                    functionarea.name = function["name"]
                    functionarea.description = function["description"]
                    functionarea.color_code = function["color_code"]
                    self.connection.commit()
            return Response(200, message="success").send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()

    def deleteTeam(self):
        try:
            print('hello')
            print(self.oData["team_id"])
            self.connection.query(mFunctionalArea).filter(mFunctionalArea.team_id == self.oData["team_id"]).delete()
            self.connection.commit()

            users = self.tenancyConnection.query(Users).filter(Users.tenant_id == self.user.get("tenant_id"),
                                                               Users.user_type == 1,
                                                               Users.team_id == self.oData["team_id"]).first()
            if users is not None:
                users.team_id = 0
                self.tenancyConnection.commit()
            self.connection.query(mTeams).filter(mTeams.id == self.oData["team_id"]).delete()
            self.connection.commit()
            return Response(200, message="success").send()
        except Exception as error:
            print(error)
            return Response(500, message="Something went wrong", error=str(error)).send()