## Backend Setup

**Create the virtual environment**
```
cd backend
python -m venv venv
```

**Activate the virtual environment**

*Windows*
```
venv\Scripts\activate
```
*Linux / Mac OS*
```
source venv/bin/activate
```

**Packages installation**
```
pip install -r requirements.txt
```

**Configure sample_ini according to your settings**

- DB_URI: Your postgres address.
- JWT_SECRET_KEY: Enter random JWT Secret Key.
- API_KEY: OpenWeather API Key.

Finish by renaming *sample_ini.txt* to *.ini*.

## Run the application

Obs. make sure you have the virtual environment enabled

```
python run.py
```

## Frontend Setup

Opens another command prompt.

**Packages installation**
```
cd frontend
npm install
```

## Run the application

```
npm run dev
```