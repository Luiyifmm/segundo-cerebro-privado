# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.00s |
| sync | 8.9 | 15/17 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 23 cues for 24 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 7.0 | 3.6 weighted events per 10 s, longest silence 7.9 s |
| variety | 10.0 | 13 source recordings, 13 families in 13 sounds (runs and interface sounds not counted) |
| hierarchy | 9.5 | 7.4 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -4.8 dBTP |
| loudness | 7.0 | final -17.3 LUFS (the author's own balance is kept) |
| balance | 3.0 | median event peak +9 dB vs the original around it, big sounds -7 dB (whole-track gap +9 LU) (15 event(s) on speech left to the speech axis) |
| audibility | 9.3 | 1 of 21 sounds sit more than 30 dB under the film's own sound in the mix (median -20 dB, after the ducking) |
| speech | 8.5 | 1 sound(s) in 1 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 8.5 | 1 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.1 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 23 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 3.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. pacing: nothing happens between 19.65s and 27.55s (7.9 s)
2. balance: sounds sit +9 dB over the original around them: they bury the voice/music, lower with --sfx-trim-db or --voice-safe
3. low end: 'drop' at 27.55s piles onto the bass already there (-25 dB); lower it 17 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer

Listen to these 4 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.00s  'riser': its peak sits +46 ms from the moment; also 'whoosh' at 0.00s: the first sound of the film: the hook. Listen for: does it feel early or late against the picture? / does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    1.87s  'whoosh': brought 6 dB up to the perceived level of its role. Listen for: a thin recording lifted that far can turn harsh: is it clean?
  3.    4.95s  'pop': 1 sound(s) on top of the voice, -0.7 dB against it. Listen for: is every word still understood?
  4.   15.95s  'pop': its peak sits -14 ms from the moment. Listen for: does it feel early or late against the picture?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).
