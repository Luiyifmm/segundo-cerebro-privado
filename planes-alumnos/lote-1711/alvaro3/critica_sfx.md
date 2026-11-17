# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.00s |
| sync | 8.9 | 14/16 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 21 cues for 21 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 8.4 | 3.4 weighted events per 10 s, longest silence 7.3 s |
| variety | 10.0 | 8 source recordings, 8 families in 8 sounds (runs and interface sounds not counted) |
| hierarchy | 7.6 | 4.8 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -4.0 dBTP |
| loudness | 10.0 | final -15.7 LUFS (the author's own balance is kept) |
| balance | 10.0 | median event peak -11 dB vs the original around it, big sounds +4 dB (whole-track gap +14 LU) (11 event(s) on speech left to the speech axis) |
| audibility | 7.9 | 3 of 20 sounds sit more than 30 dB under the film's own sound in the mix (median -18 dB, after the ducking) |
| speech | 10.0 | 0 sound(s) in 0 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 8.5 | 1 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.0 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 21 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 7.6 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. audibility: 3 sounds (click) are 30+ dB under the film's own sound in the mix: they cannot be heard. The ducking took them out: --voice-depth light (or normal), or a higher gain_db on those
2. low end: 'sub_drop' at 0.02s piles onto the bass already there (-27 dB); lower it 20 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer
3. hierarchy: all sounds sit within 4.8 dB; make the big moments clearly bigger and the small ticks quieter

Listen to these 4 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.00s  'whoosh': the first sound of the film: the hook; also '' at 0.50s: the busiest two seconds (4 sounds). Listen for: does it land with the picture at once, and is it clearly there under the music or the voice? / is every sound still distinct, or does it turn to mud?
  2.   10.62s  'pop': its peak sits -14 ms from the moment; its attack was moved 249 ms so that it lands on the moment. Listen for: does it feel early or late against the picture? / does the lead-in still read as part of the sound?
  3.   25.64s  'pop': its peak sits -14 ms from the moment. Listen for: does it feel early or late against the picture?
  4.   29.20s  'click': the highest peak of the film (-8 dBFS before the master). Listen for: is it big without hurting on headphones, and does the music under it pump?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).
