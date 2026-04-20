@echo off
setlocal
echo [SkillSprint] AGGRESSIVE CLEANUP INITIATED...
taskkill /F /IM go.exe /T 2>nul
taskkill /F /IM main.exe /T 2>nul
taskkill /F /IM master_backend.exe /T 2>nul
taskkill /F /IM stabilized_8080.exe /T 2>nul
taskkill /F /IM backend.exe /T 2>nul

echo [SkillSprint] FORCING PORT 8080 LIBERATION...
for /f "tokens=5" %%a in ('netstat -aon ^| findStr :8080') do (
    echo [SkillSprint] Terminating PID %%a holding port 8080...
    taskkill /F /PID %%a /T 2>nul
)

timeout /t 2 /nobreak >nul

echo [SkillSprint] COMPILING NEURAL ENGINE (8080)...
go build -o master_backend.exe main.go
if %errorlevel% neq 0 (
    echo [ERROR] Compilation failed. Check your Go code.
    pause
    exit /b %errorlevel%
)

echo [SkillSprint] LAUNCHING SYNCHRONIZED BACKEND...
:: Start the backend in a new window but redirect its output to backend.log
start "SkillSprint_Backend" cmd /c "master_backend.exe > backend.log 2>&1"

echo [SkillSprint] ----------------------------------------------
echo [SkillSprint] SUCCESS: Backend is rebuilding and launching.
echo [SkillSprint] Output is being redirected to backend.log
echo [SkillSprint] ----------------------------------------------
timeout /t 3 /nobreak >nul
