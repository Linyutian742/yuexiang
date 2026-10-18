@echo off
chcp 936 >nul
title 一键上传 GitHub

REM ============================================================
REM 配置区 —— 改成你自己的仓库地址和分支
REM ============================================================
set "REMOTE_URL=https://github.com/Linyutian742/yuexiang.git"
set "BRANCH=master"

echo ============================================================
echo           一键上传 GitHub
echo ============================================================

REM 检查是否安装了 Git
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Git，请先安装：https://git-scm.com/download/win
    pause
    exit /b 1
)

REM 如果没有 .git 目录，初始化仓库
if not exist ".git" (
    echo [信息] 当前目录不是 git 仓库，正在初始化...
    git init
)

REM 自动设置 Git 用户信息（仅用于此仓库，不影响全局）
git config user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo [信息] 未检测到 Git 用户名，设置临时默认值
    git config user.name "User"
)
git config user.email >nul 2>&1
if %errorlevel% neq 0 (
    echo [信息] 未检测到 Git 邮箱，设置临时默认值
    git config user.email "user@localhost"
)

REM 添加远程仓库（如果不存在）
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    git remote add origin "%REMOTE_URL%"
    echo [信息] 已添加远程仓库：%REMOTE_URL%
) else (
    git remote set-url origin "%REMOTE_URL%"
)

REM 将脚本自身加入 .gitignore（防止上传）
set "SCRIPT_NAME=%~nx0"
findstr /C:"%SCRIPT_NAME%" .gitignore >nul 2>&1
if %errorlevel% neq 0 (
    echo %SCRIPT_NAME%>>.gitignore
)
REM 如果之前误追踪过脚本，取消追踪
git rm --cached "%SCRIPT_NAME%" >nul 2>&1

REM 暂存所有文件（新增、修改、删除）
git add -A

REM 检查是否有任何变更（包括新文件）
git diff-index --cached --quiet HEAD >nul 2>&1
if %errorlevel% equ 0 (
    REM 没有变更，但仍然需要初始提交（针对空仓库）
    git commit --allow-empty -m "初始提交 - %DATE% %TIME%"
    echo [信息] 创建了初始空提交
) else (
    setlocal enabledelayedexpansion
    if "%~1"=="" (
        git commit -m "更新于 %DATE% %TIME%"
    ) else (
        git commit -m "%~1"
    )
    endlocal
)

REM 强制推送到远程（覆盖历史）
echo [信息] 正在强制覆盖远程 %BRANCH% 分支...
git push --force origin "%BRANCH%"
if %errorlevel% neq 0 (
    echo [错误] 推送失败。建议：
    echo   1. 检查 REMOTE_URL 是否正确
    echo   2. 检查 SSH key / 账户权限是否配置
    echo   3. 如果是首次推送，可尝试：git push -u origin %BRANCH%
) else (
    echo [成功] 已强制覆盖远程 %BRANCH% 分支！
)

pause
