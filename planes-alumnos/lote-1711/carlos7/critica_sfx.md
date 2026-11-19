# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.00s |
| sync | 9.2 | 20/22 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 29 cues for 31 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 7.3 | 4.5 weighted events per 10 s, longest silence 7.4 s |
| variety | 10.0 | 18 source recordings, 17 families in 19 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 13.3 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -3.9 dBTP |
| loudness | 7.0 | final -17.5 LUFS (the author's own balance is kept) |
| balance | 7.0 | median event peak -5 dB vs the original around it, big sounds -10 dB (whole-track gap +8 LU) (18 event(s) on speech left to the speech axis) |
| audibility | 8.4 | 3 of 26 sounds sit more than 30 dB under the film's own sound in the mix (median -17 dB, after the ducking) |
| speech | 8.5 | 1 sound(s) in 1 moment(s) are within 3 dB of the voice or above it (1 above) even after ducking |
| low_end | 2.5 | 5 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.1 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 29 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 2.5 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. low end: 'hit x0.80' at 1.92s piles onto the bass already there (-22 dB); lower it 1 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
2. low end: 'hit x0.60' at 2.70s piles onto the bass already there (-24 dB); lower it 10 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
3. balance: median sound is -5 dB under the original, weakest at 27.05s, 29.42s: raise gain_db there (sheet.py gain --db +N --between A B) and render with --no-match-layer: the layer match keeps the whole layer at the loudness of the sound it replaces and takes back a raise that is made on every cue

Listen to these 4 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.00s  'riser': its peak sits +46 ms from the moment; also 'whoosh' at 0.00s: the first sound of the film: the hook. Listen for: does it feel early or late against the picture? / does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    1.87s  'whoosh': brought 6 dB up to the perceived level of its role; also 'hit x0.80' at 1.92s: the highest peak of the film (-4 dBFS before the master). Listen for: a thin recording lifted that far can turn harsh: is it clean? / is it big without hurting on headphones, and does the music under it pump?
  3.    4.95s  'pop': 1 sound(s) on top of the voice, +0.1 dB against it. Listen for: is every word still understood?
  4.   15.95s  'pop': its peak sits -14 ms from the moment. Listen for: does it feel early or late against the picture?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).
