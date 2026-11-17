# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.00s |
| sync | 10.0 | 19/19 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 23 cues for 23 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 4.2 | 2.1 weighted events per 10 s, longest silence 10.8 s |
| variety | 10.0 | 4 source recordings, 4 families in 4 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 14.7 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -5.0 dBTP |
| loudness | 10.0 | final -15.7 LUFS (the author's own balance is kept) |
| balance | 7.0 | median event peak -9 dB vs the original around it, big sounds +6 dB (whole-track gap +14 LU) (11 event(s) on speech left to the speech axis) |
| audibility | 5.5 | 7 of 22 sounds sit more than 30 dB under the film's own sound in the mix (median -27 dB, after the ducking) |
| speech | 10.0 | 0 sound(s) in 0 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 7.0 | 2 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.0 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 23 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 4.2 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. pacing: nothing happens between 35.41s and 46.18s (10.8 s)
2. balance: sounds sit +6 dB over the original around them: they bury the voice/music, lower with --sfx-trim-db or --voice-safe
3. audibility: 7 sounds (click) are 30+ dB under the film's own sound in the mix: they cannot be heard. The ducking took them out: --voice-depth light (or normal), or a higher gain_db on those

Listen to these 3 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.00s  'whoosh': the first sound of the film: the hook; also 'sub_drop' at 0.02s: the highest peak of the film (-10 dBFS before the master). Listen for: does it land with the picture at once, and is it clearly there under the music or the voice? / is it big without hurting on headphones, and does the music under it pump?
  2.   25.83s  'click': its attack was moved 303 ms so that it lands on the moment. Listen for: does the lead-in still read as part of the sound?
  3.   46.18s  'swoosh': the quietest by perceived loudness among the sounds that are not ticks. Listen for: can it be heard at all?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).
