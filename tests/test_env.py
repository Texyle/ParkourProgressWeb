from app.env import get_var

def test_get_var_existing_variable() -> None:
    assert get_var("IS_TEST") == "True"

def test_get_var_non_existing_variable() -> None:
    assert get_var("NON_EXISTENT_VAR") is None