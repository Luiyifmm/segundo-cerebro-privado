# voz_onecore.ps1 - locucion con las voces "OneCore" de Windows (Pablo, Laura, Helena en es-ES), mas naturales que la
# voz de escritorio de generar_locuciones_TTS.ps1. Lee un SSML en UTF-8 (pausas con <break time="300ms"/>, velocidad con
# <prosody rate="-6%">) y escribe un WAV. Este .ps1 va solo en ASCII: los textos con tildes viven en el .ssml.
# Uso: powershell -ExecutionPolicy Bypass -File voz_onecore.ps1 -ssml guion.ssml -wav salida.wav -voz Pablo
param([string]$ssml, [string]$wav, [string]$voz = "Pablo")
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTaskGen = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
function Await($op, $tipo) {
  $t = $asTaskGen.MakeGenericMethod($tipo).Invoke($null, @($op))
  $t.Wait(-1) | Out-Null
  return $t.Result
}
[Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.Streams.DataReader, Windows.Storage.Streams, ContentType = WindowsRuntime] | Out-Null
$s = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
$v = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices | Where-Object { $_.DisplayName -like "*$voz*" -and $_.Language -like "es*" } | Select-Object -First 1
if (-not $v) { throw "No encuentro la voz $voz" }
$s.Voice = $v
$texto = [IO.File]::ReadAllText($ssml, [Text.Encoding]::UTF8)
$st = Await ($s.SynthesizeSsmlToStreamAsync($texto)) ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])
$r = New-Object Windows.Storage.Streams.DataReader($st.GetInputStreamAt(0))
$n = [uint32]$st.Size
Await ($r.LoadAsync($n)) ([uint32]) | Out-Null
$b = New-Object byte[] $n
$r.ReadBytes($b)
[IO.File]::WriteAllBytes($wav, $b)
"{0}: {1:N0} bytes con la voz {2}" -f $wav, $n, $v.DisplayName
