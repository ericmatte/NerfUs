from models.gun import Gun


def test_db(client):
    assert len(Gun.get_all()) > 0