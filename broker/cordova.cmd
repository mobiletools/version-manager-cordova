@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  ".\cordova" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  ".\cordova" %*
)
