from nerfus import app
from tests import set_current_user


def test_get_routes(client):
    """Test all web page"""
    with set_current_user():
        for route in app.url_map.iter_rules():
            if 'GET' in route.methods and route.endpoint != 'static':
                req = client.get(route.rule)
                print("Route to {0} validated with status '{1}'".format(route.rule, req.status))
                assert req.status_code < 400
