# Genera locuciones en español con la voz local de Windows (Helena) → WAV
param([string]$outDir)
Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$s.SelectVoice("Microsoft Helena Desktop")
$s.Rate = 0
$frases = [ordered]@{
  "f1_imposible" = "¡Imposible que me lo perdiera!"
  "f2_mil"       = "¡Acabo de ganar cincuenta mil dólares!"
  "f3_tres"      = "Solo nos quedaban tres días para alcanzar nuestra meta, o estábamos fuera."
  "f4_mata"      = "¡Amigo, casi me mata!"
  "f5_realmente" = "¿Alguna vez has visto a un futbolista realmente bueno que sigue fallando goles?"
  "f6_semanas"   = "Estábamos tardando semanas, cuando deberíamos haberlo hecho en días."
  "concurso"     = "Los participantes tendrán que formar grupos de cinco personas. Tienen dos minutos para hacerlo, y entrar a los aros que tienen al frente. Comenzando... ¡ya!"
}
foreach ($k in $frases.Keys) {
  $p = Join-Path $outDir ($k + ".wav")
  $s.SetOutputToWaveFile($p)
  $s.Speak($frases[$k])
}
$s.SetOutputToNull()
$s.Dispose()
Get-ChildItem $outDir -Filter *.wav | Select-Object Name, Length
