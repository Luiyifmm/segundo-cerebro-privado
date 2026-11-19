# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.05s |
| sync | 9.2 | 21/23 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 41 cues for 41 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 7.8 | 4.5 weighted events per 10 s, longest silence 8.1 s; 1 runs of typing/ticks count once (7 sounds) |
| variety | 10.0 | 22 source recordings, 21 families in 22 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 15.1 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -4.6 dBTP |
| loudness | 7.0 | final -17.3 LUFS (the author's own balance is kept) |
| balance | 7.0 | median event peak -10 dB vs the original around it, big sounds -15 dB (whole-track gap +12 LU) (22 event(s) on speech left to the speech axis) |
| audibility | 9.3 | 2 of 41 sounds sit more than 30 dB under the film's own sound in the mix (median -20 dB, after the ducking) |
| speech | 10.0 | 0 sound(s) in 0 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 5.5 | 3 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.4 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 41 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 5.5 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. pacing: nothing happens between 32.05s and 40.15s (8.1 s)
2. low end: 'hit x0.60' at 2.84s piles onto the bass already there (-29 dB); lower it 4 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
3. low end: 'hit x0.50' at 31.97s piles onto the bass already there (-26 dB); lower it 8 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.05s  'riser': the first sound of the film: the hook; its attack was moved 350 ms so that it lands on the moment. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice? / does the lead-in still read as part of the sound?
  2.    2.84s  'hit x0.60': brought 6 dB up to the perceived level of its role. Listen for: a thin recording lifted that far can turn harsh: is it clean?
  3.   16.71s  'pop': its peak sits -14 ms from the moment. Listen for: does it feel early or late against the picture?
  4.   32.47s  the busiest two seconds (9 sounds). Listen for: is every sound still distinct, or does it turn to mud?
  5.   40.60s  'hit': the highest peak of the film (-4 dBFS before the master). Listen for: is it big without hurting on headphones, and does the music under it pump?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).
