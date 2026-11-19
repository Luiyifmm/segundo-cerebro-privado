# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.00s |
| sync | 9.6 | 24/25 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 60 cues for 64 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 8.3 | 5.9 weighted events per 10 s, longest silence 7.5 s; 2 runs of typing/ticks count once (26 sounds) |
| variety | 10.0 | 21 source recordings, 21 families in 21 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 21.1 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -3.7 dBTP |
| loudness | 10.0 | final -15.7 LUFS (the author's own balance is kept) |
| balance | 10.0 | median event peak -7 dB vs the original around it, big sounds -7 dB (whole-track gap +11 LU) (18 event(s) on speech left to the speech axis) |
| audibility | 6.6 | 14 of 58 sounds sit more than 30 dB under the film's own sound in the mix (median -21 dB, after the ducking) |
| speech | 8.5 | 1 sound(s) in 1 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 5.5 | 3 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.1 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 60 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 5.5 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. low end: 'sub_drop' at 0.02s piles onto the bass already there (-25 dB); lower it 18 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
2. low end: 'hit' at 9.07s piles onto the bass already there (-29 dB); lower it 10 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
3. audibility: 14 sounds (click) are 30+ dB under the film's own sound in the mix: they cannot be heard. The ducking took them out: --voice-depth light (or normal), or a higher gain_db on those

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.05s  'hit': brought 6 dB up to the perceived level of its role; also 'whoosh' at 0.00s: the first sound of the film: the hook. Listen for: a thin recording lifted that far can turn harsh: is it clean? / does it land with the picture at once, and is it clearly there under the music or the voice?
  2.    6.47s  the busiest two seconds (15 sounds); also 'riser' at 5.30s: the quietest by perceived loudness among the sounds that are not ticks. Listen for: is every sound still distinct, or does it turn to mud? / can it be heard at all?
  3.    9.10s  'tick': its peak sits -35 ms from the moment. Listen for: does it feel early or late against the picture?
  4.   19.82s  'click': its attack was moved 303 ms so that it lands on the moment. Listen for: does the lead-in still read as part of the sound?
  5.   28.07s  'click': 1 sound(s) on top of the voice, -2.4 dB against it. Listen for: is every word still understood?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).
