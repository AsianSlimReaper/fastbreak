import bcrypt

#purpose: encrypt passwords and verify them, normalize email addresses
#input: password (str),
#output: hashed password (str)
def hash_password(password: str) -> str:
    #hash the password using bcrypt
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

#input: plain_password (str), hashed_password (str)
#output: boolean (True if passwords match, False otherwise)
def verify_password(plain_password: str, hashed_password: str) -> bool:
    #compare the plain password with the hashed password by encrypting the plain password and checking if it matches the hashed password
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

#input: email (str)
#output: normalized email (str)
def normalize_email(email: str) -> str:
    #strip whitespace and convert to lowercase
    return email.strip().lower()