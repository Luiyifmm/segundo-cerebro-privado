# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.00s |
| sync | 8.8 | 13/15 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 17 cues for 17 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 8.0 | 3.2 weighted events per 10 s, longest silence 7.9 s |
| variety | 10.0 | 8 source recordings, 8 families in 8 sounds (runs and interface sounds not counted) |
| hierarchy | 9.9 | 7.9 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -4.7 dBTP |
| loudness | 7.0 | final -17.3 LUFS (the author's own balance is kept) |
| balance | 3.0 | median event peak +9 dB vs the original around it, big sounds -3 dB (whole-track gap +9 LU) (9 event(s) on speech left to the speech axis) |
| audibility | 10.0 | 0 of 14 sounds sit more than 30 dB under the film's own sound in the mix (median -9 dB, after the ducking) |
| speech | 10.0 | 0 sound(s) in 0 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 8.5 | 1 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.0 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 17 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 3.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. pacing: nothing happens between 19.65s and 27.55s (7.9 s)
2. balance: sounds sit +9 dB over the original around them: they bury the voice/music, lower with --sfx-trim-db or --voice-safe
3. low end: 'drop' at 27.55s piles onto the bass already there (-25 dB); lower it 17 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.00s  'riser': the first sound of the film: the hook; its attack was moved 350 ms so that it lands on the moment. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice? / does the lead-in still read as part of the sound?
  2.   15.95s  'pop': its peak sits -14 ms from the moment. Listen for: does it feel early or late against the picture?
  3.   28.39s  'pop': its peak sits -14 ms from the moment. Listen for: does it feel early or late against the picture?
  4.   35.05s  'swoosh': brought 6 dB up to the perceived level of its role. Listen for: a thin recording lifted that far can turn harsh: is it clean?
  5.   38.25s  'click': the highest peak of the film (-9 dBFS before the master). Listen for: is it big without hurting on headphones, and does the music under it pump?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).
