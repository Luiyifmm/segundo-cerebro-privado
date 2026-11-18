# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.00s |
| sync | 10.0 | 13/13 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 20 cues for 20 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 4.4 | 2.2 weighted events per 10 s, longest silence 12.7 s |
| variety | 10.0 | 8 source recordings, 8 families in 8 sounds (runs and interface sounds not counted) |
| hierarchy | 9.3 | 7.1 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -4.8 dBTP |
| loudness | 7.0 | final -17.1 LUFS (the author's own balance is kept) |
| balance | 7.0 | median event peak -11 dB vs the original around it, big sounds -11 dB (whole-track gap +14 LU) (12 event(s) on speech left to the speech axis) |
| audibility | 8.6 | 2 of 20 sounds sit more than 30 dB under the film's own sound in the mix (median -22 dB, after the ducking) |
| speech | 10.0 | 0 sound(s) in 0 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 8.5 | 1 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.4 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 20 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 4.4 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. pacing: nothing happens between 35.72s and 48.38s (12.7 s)
2. balance: median sound is -11 dB under the original, weakest at 14.51s, 15.65s: raise gain_db there (sheet.py gain --db +N --between A B) and render with --no-match-layer: the layer match keeps the whole layer at the loudness of the sound it replaces and takes back a raise that is made on every cue
3. low end: 'hit' at 0.05s piles onto the bass already there (-29 dB); lower it 3 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer

Listen to these 3 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.00s  'whoosh': the first sound of the film: the hook; the quietest by perceived loudness among the sounds that are not ticks. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice? / can it be heard at all?
  2.   30.11s  'pop': its attack was moved 149 ms so that it lands on the moment. Listen for: does the lead-in still read as part of the sound?
  3.   32.67s  'click': the highest peak of the film (-8 dBFS before the master). Listen for: is it big without hurting on headphones, and does the music under it pump?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).
