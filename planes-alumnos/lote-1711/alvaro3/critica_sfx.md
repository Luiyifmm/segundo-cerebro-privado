# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.00s |
| sync | 10.0 | 21/21 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 37 cues for 37 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 8.3 | 5.4 weighted events per 10 s, longest silence 7.5 s; 1 runs of typing/ticks count once (7 sounds) |
| variety | 10.0 | 19 source recordings, 18 families in 19 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 19.2 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -4.7 dBTP |
| loudness | 10.0 | final -15.7 LUFS (the author's own balance is kept) |
| balance | 10.0 | median event peak -10 dB vs the original around it, big sounds -5 dB (whole-track gap +11 LU) (15 event(s) on speech left to the speech axis) |
| audibility | 7.0 | 7 of 33 sounds sit more than 30 dB under the film's own sound in the mix (median -20 dB, after the ducking) |
| speech | 10.0 | 0 sound(s) in 0 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 8.5 | 1 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.1 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 37 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 7.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. audibility: 7 sounds (click) are 30+ dB under the film's own sound in the mix: they cannot be heard. The ducking took them out: --voice-depth light (or normal), or a higher gain_db on those
2. low end: 'sub_drop' at 0.02s piles onto the bass already there (-27 dB); lower it 19 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer

Listen to these 4 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.00s  'whoosh': the first sound of the film: the hook; also 'sub_drop' at 0.02s: the highest peak of the film (-10 dBFS before the master). Listen for: does it land with the picture at once, and is it clearly there under the music or the voice? / is it big without hurting on headphones, and does the music under it pump?
  2.    5.30s  'riser': the quietest by perceived loudness among the sounds that are not ticks. Listen for: can it be heard at all?
  3.   25.40s  the busiest two seconds (12 sounds). Listen for: is every sound still distinct, or does it turn to mud?
  4.   28.07s  'click': its attack was moved 303 ms so that it lands on the moment. Listen for: does the lead-in still read as part of the sound?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).
