# Credit Card Tracker Installation Script for Windows 11
# This script sets up the development environment for the Credit Card Tracker app

Write-Host "Starting Credit Card Tracker Installation..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "Node.js $nodeVersion is already installed." -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit
}

# Check if PostgreSQL is installed
try {
    $psqlCheck = Get-Command psql -ErrorAction Stop
    Write-Host "PostgreSQL is already installed." -ForegroundColor Green
} catch {
    Write-Host "PostgreSQL is not detected. Installing PostgreSQL could require admin privileges." -ForegroundColor Yellow
    Write-Host "Please download and install PostgreSQL from https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    
    $installPostgres = Read-Host "Do you want to continue without PostgreSQL? (Y/N)"
    
    if ($installPostgres -ne "Y") {
        exit
    }
}

# Install dependencies for frontend
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location -Path ".\frontend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install frontend dependencies." -ForegroundColor Red
    exit
}

# Install dependencies for backend
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
Set-Location -Path "..\backend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install backend dependencies." -ForegroundColor Red
    exit
}

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file for backend..." -ForegroundColor Cyan
    
    $dbUser = Read-Host "Enter PostgreSQL username (default: postgres)"
    if ([string]::IsNullOrEmpty($dbUser)) { $dbUser = "postgres" }
    
    $dbPassword = Read-Host "Enter PostgreSQL password" -AsSecureString
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
    $dbPasswordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    
    $dbHost = Read-Host "Enter PostgreSQL host (default: localhost)"
    if ([string]::IsNullOrEmpty($dbHost)) { $dbHost = "localhost" }
    
    $dbPort = Read-Host "Enter PostgreSQL port (default: 5432)"
    if ([string]::IsNullOrEmpty($dbPort)) { $dbPort = "5432" }
    
    $dbName = Read-Host "Enter database name (default: credit_card_debt_tracker)"
    if ([string]::IsNullOrEmpty($dbName)) { $dbName = "credit_card_debt_tracker" }
    
    $connectionString = "postgresql://${dbUser}:${dbPasswordPlain}@${dbHost}:${dbPort}/${dbName}"
    
    $envContent = @"
DATABASE_URL="$connectionString"
PORT=3001
NODE_ENV=development
"@
    
    Set-Content -Path ".env" -Value $envContent
    Write-Host ".env file created successfully." -ForegroundColor Green
}

# Attempt to set up the database
Write-Host "Setting up the database..." -ForegroundColor Cyan
try {
    npx prisma migrate dev
    if ($LASTEXITCODE -ne 0) {
        throw "Prisma migration failed."
    }
    Write-Host "Database set up successfully." -ForegroundColor Green
} catch {
    Write-Host "Failed to set up the database. Please check your PostgreSQL connection." -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "You may need to create the database manually before running migrations." -ForegroundColor Yellow
}

# Return to root directory
Set-Location -Path ".."

Write-Host "Installation complete!" -ForegroundColor Green
Write-Host "To start the backend server:" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host "To start the frontend server:" -ForegroundColor Cyan
Write-Host "  cd frontend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White

# Ask if user wants to start servers now
$startServers = Read-Host "Do you want to start the servers now? (Y/N)"

if ($startServers -eq "Y") {
    # Start backend server in a new PowerShell window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -Path '$pwd\backend'; npm run dev"
    
    # Start frontend server in a new PowerShell window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -Path '$pwd\frontend'; npm run dev"
    
    Write-Host "Servers started in new windows." -ForegroundColor Green
} 