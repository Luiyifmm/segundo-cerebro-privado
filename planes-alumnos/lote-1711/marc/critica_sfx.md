# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.00s |
| sync | 9.2 | 11/12 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 19 cues for 19 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 5.4 | 2.5 weighted events per 10 s, longest silence 10.1 s |
| variety | 10.0 | 11 source recordings, 11 families in 11 sounds (runs and interface sounds not counted) |
| hierarchy | 7.6 | 4.8 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -4.9 dBTP |
| loudness | 10.0 | final -15.8 LUFS (the author's own balance is kept) |
| balance | 7.0 | median event peak -11 dB vs the original around it, big sounds -10 dB (whole-track gap +14 LU) (11 event(s) on speech left to the speech axis) |
| audibility | 9.3 | 1 of 19 sounds sit more than 30 dB under the film's own sound in the mix (median -15 dB, after the ducking) |
| speech | 7.0 | 4 sound(s) in 2 moment(s) are within 3 dB of the voice or above it (1 above) even after ducking |
| low_end | 7.0 | 2 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.1 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 19 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 5.4 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. pacing: nothing happens between 9.65s and 19.73s (10.1 s)
2. speech: 1 sound(s) around 5.68s ('whoosh' +4.2 dB vs the voice); lower them, shorten them, move into a pause (--voice-depth deep ducks by about 24 dB in speech: check the LUFS of *_sfx_ducked.wav before you use it)
3. balance: median sound is -11 dB under the original, weakest at 34.96s, 26.25s: raise gain_db there (sheet.py gain --db +N --between A B) and render with --no-match-layer: the layer match keeps the whole layer at the loudness of the sound it replaces and takes back a raise that is made on every cue

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.00s  'whoosh': the first sound of the film: the hook; also '' at 0.50s: the busiest two seconds (4 sounds). Listen for: does it land with the picture at once, and is it clearly there under the music or the voice? / is every sound still distinct, or does it turn to mud?
  2.    5.68s  'whoosh': 1 sound(s) on top of the voice, +4.2 dB against it. Listen for: is every word still understood?
  3.   26.25s  'pop': its peak sits -14 ms from the moment; its attack was moved 249 ms so that it lands on the moment. Listen for: does it feel early or late against the picture? / does the lead-in still read as part of the sound?
  4.   37.23s  'whoosh': the quietest by perceived loudness among the sounds that are not ticks. Listen for: can it be heard at all?
  5.   48.63s  'click': the highest peak of the film (-9 dBFS before the master). Listen for: is it big without hurting on headphones, and does the music under it pump?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).
