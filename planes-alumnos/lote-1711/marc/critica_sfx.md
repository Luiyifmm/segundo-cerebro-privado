# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.00s |
| sync | 10.0 | 25/25 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 35 cues for 36 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 8.1 | 5.2 weighted events per 10 s, longest silence 6.3 s |
| variety | 10.0 | 22 source recordings, 20 families in 22 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 11.5 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -4.8 dBTP |
| loudness | 10.0 | final -15.9 LUFS (the author's own balance is kept) |
| balance | 7.0 | median event peak -12 dB vs the original around it, big sounds -14 dB (whole-track gap +13 LU) (15 event(s) on speech left to the speech axis) |
| audibility | 7.6 | 6 of 35 sounds sit more than 30 dB under the film's own sound in the mix (median -19 dB, after the ducking) |
| speech | 10.0 | 0 sound(s) in 0 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 4.0 | 4 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.2 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 35 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 4.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. low end: 'hit x0.70' at 0.02s piles onto the bass already there (-25 dB); lower it 3 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
2. low end: 'hit' at 0.05s piles onto the bass already there (-25 dB); lower it 3 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
3. balance: median sound is -12 dB under the original, weakest at 32.62s, 10.62s: raise gain_db there (sheet.py gain --db +N --between A B) and render with --no-match-layer: the layer match keeps the whole layer at the loudness of the sound it replaces and takes back a raise that is made on every cue

Listen to these 3 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.02s  'hit x0.70': brought 6 dB up to the perceived level of its role; also 'whoosh' at 0.00s: the first sound of the film: the hook. Listen for: a thin recording lifted that far can turn harsh: is it clean? / does it land with the picture at once, and is it clearly there under the music or the voice?
  2.   32.62s  'whoosh x0.45': the quietest by perceived loudness among the sounds that are not ticks. Listen for: can it be heard at all?
  3.   48.13s  'click': its attack was moved 151 ms so that it lands on the moment. Listen for: does the lead-in still read as part of the sound?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).
