from google.appengine.ext import endpoints
from google.appengine.ext import ndb
from protorpc import messages
from protorpc import message_types
from protorpc import remote


class Data(messages.Message):
    user_name = messages.StringField(1)
    user_token = messages.StringField(2)

class DataModel(ndb.Model):
    user_name = ndb.StringProperty(required = True)
    user_token = ndb.StringProperty(required = True)

class DataCollection(messages.Message):
    items = messages.MessageField(Data, 1, repeated = True)

@endpoints.api(name='trytresor', version='v1')
class DataOutput(remote.Service):
    @endpoints.method(Data, Data,
                                        name = 'datas.insert',
                                        path = 'data',
                                        http_method = 'POST')
    def insert_data(self, request):
        DataModel(user_name = request.user_name, user_token = request.user_token).put()
        return request
    @endpoints.method(message_types.VoidMessage, DataCollection,
                                    name = 'datas.list',
                                    path = 'datas',
                                    http_method = 'GET')
    def list_data(self, unused_request):
        data = [Data(user_name = datamodel.user_name, user_token = datamodel.user_token) for datamodel in DataModel.query()]
        response = DataCollection(items = data)
        return response

application = endpoints.api_server([DataOutput])    

    