# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.00s |
| sync | 10.0 | 10/10 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 14 cues for 14 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 3.3 | 1.7 weighted events per 10 s, longest silence 12.9 s |
| variety | 10.0 | 6 source recordings, 6 families in 6 sounds (runs and interface sounds not counted) |
| hierarchy | 6.3 | 3.1 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -4.9 dBTP |
| loudness | 10.0 | final -16.7 LUFS (the author's own balance is kept) |
| balance | 7.0 | median event peak -12 dB vs the original around it, big sounds -12 dB (whole-track gap +17 LU) (5 event(s) on speech left to the speech axis) |
| audibility | 9.0 | 1 of 14 sounds sit more than 30 dB under the film's own sound in the mix (median -15 dB, after the ducking) |
| speech | 8.5 | 1 sound(s) in 1 moment(s) are within 3 dB of the voice or above it (1 above) even after ducking |
| low_end | 10.0 | 0 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.4 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 14 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 3.3 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. pacing: nothing happens between 19.43s and 32.37s (12.9 s)
2. balance: median sound is -12 dB under the original, weakest at 32.37s, 37.80s: raise gain_db there (sheet.py gain --db +N --between A B) and render with --no-match-layer: the layer match keeps the whole layer at the loudness of the sound it replaces and takes back a raise that is made on every cue
3. speech: 1 sound(s) around 19.43s ('whoosh' +2.8 dB vs the voice); lower them, shorten them, move into a pause (--voice-depth deep ducks by about 24 dB in speech: check the LUFS of *_sfx_ducked.wav before you use it)

Listen to these 4 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.00s  'whoosh': the first sound of the film: the hook; the quietest by perceived loudness among the sounds that are not ticks. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice? / can it be heard at all?
  2.   19.43s  'whoosh': 1 sound(s) on top of the voice, +2.8 dB against it. Listen for: is every word still understood?
  3.   42.07s  'pop': its attack was moved 112 ms so that it lands on the moment. Listen for: does the lead-in still read as part of the sound?
  4.   49.85s  'click': the highest peak of the film (-8 dBFS before the master). Listen for: is it big without hurting on headphones, and does the music under it pump?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).
