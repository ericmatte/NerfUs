import pytest
from sqlalchemy import event

from nerfus.flask import app, db_session

@pytest.fixture
def client(request):
    """This function put flask in testing mode
       Nothing will be really saved to the database within this mode
    """
    app.config.update({ 'TESTING': True })

    # start the session in a SAVEPOINT...
    db_session.begin_nested()
    # then each time that SAVEPOINT ends, reopen it
    @event.listens_for(db_session, "after_transaction_end")
    def restart_savepoint(session, transaction):
        if transaction.nested and not transaction._parent.nested:
            db_session.begin_nested()
    def teardown():
        db_session.rollback()
        db_session.close()

    request.addfinalizer(teardown)
    return app.test_client()