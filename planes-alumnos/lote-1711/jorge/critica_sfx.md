# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.00s |
| sync | 8.9 | 28/32 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 38 cues for 38 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 6.0 | 4.5 weighted events per 10 s, longest silence 7.9 s |
| variety | 10.0 | 21 source recordings, 21 families in 21 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 11.9 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -4.7 dBTP |
| loudness | 10.0 | final -16.8 LUFS (the author's own balance is kept) |
| balance | 10.0 | median event peak -6 dB vs the original around it, big sounds -6 dB (whole-track gap +12 LU) (22 event(s) on speech left to the speech axis) |
| audibility | 8.9 | 3 of 38 sounds sit more than 30 dB under the film's own sound in the mix (median -16 dB, after the ducking) |
| speech | 8.5 | 1 sound(s) in 1 moment(s) are within 3 dB of the voice or above it (1 above) even after ducking |
| low_end | 5.5 | 3 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.2 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 38 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 5.5 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. low end: 'hit x0.60' at 32.37s piles onto the bass already there (-22 dB); lower it 8 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
2. low end: 'hit' at 35.97s piles onto the bass already there (-31 dB); lower it 12 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
3. pacing: nothing happens between 19.92s and 27.80s (7.9 s)

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.00s  'riser': the first sound of the film: the hook; its attack was moved 350 ms so that it lands on the moment. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice? / does the lead-in still read as part of the sound?
  2.    8.50s  'pop': its peak sits +53 ms from the moment. Listen for: does it feel early or late against the picture?
  3.   13.37s  'hit x0.60': brought 6 dB up to the perceived level of its role. Listen for: a thin recording lifted that far can turn harsh: is it clean?
  4.   19.43s  'whoosh': 1 sound(s) on top of the voice, +2.3 dB against it. Listen for: is every word still understood?
  5.   35.97s  'hit': the highest peak of the film (-4 dBFS before the master); also '' at 36.47s: the busiest two seconds (6 sounds). Listen for: is it big without hurting on headphones, and does the music under it pump? / is every sound still distinct, or does it turn to mud?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).
