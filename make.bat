@echo off
REM Simula un Makefile con varias reglas en un archivo batch

if "%1" == "setup" goto setup
if "%1" == "lint" goto lint
if "%1" == "test" goto test
if "%1" == "run" goto run
if "%1" == "migrate" goto migrate
if "%1" == "help" goto help
goto end



:setup
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
goto end

:lint
call venv\Scripts\activate
ruff format .
goto end

:test
call venv\Scripts\activate
pytohn manage.py test
goto end

:run
call venv\Scripts\activate
python manage.py runserver
goto end

:migrate
call venv\Scripts\activate
python manage.py migrate
goto end

:help
echo Available Commands:
echo setup      Create and activate the Virtual Environment, and install dependencies
echo lint       Format python files
echo test       Run Django tests
echo run        Run Django server
echo migrate    Apply modifications to Database
goto end

:end
