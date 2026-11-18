# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.00s |
| sync | 7.0 | 8/9 sounds on their frame (peaks, arrivals, or first onsets for clicks); 1 cue(s) missing from the track |
| coverage | n/a | 14 cues for 14 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 4.4 | 2.2 weighted events per 10 s, longest silence 65.9 s |
| variety | 10.0 | 6 source recordings, 6 families in 6 sounds (runs and interface sounds not counted) |
| hierarchy | 7.2 | 4.3 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -4.9 dBTP |
| loudness | 7.0 | final -17.3 LUFS (the author's own balance is kept) |
| balance | 3.0 | median event peak +9 dB vs the original around it, big sounds -4 dB (whole-track gap +14 LU) (6 event(s) on speech left to the speech axis) |
| audibility | 10.0 | 0 of 11 sounds sit more than 30 dB under the film's own sound in the mix (median -13 dB, after the ducking) |
| speech | 10.0 | 0 sound(s) in 0 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 10.0 | 0 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.4 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 14 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 3.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. render: 'click' at 1:40.90 is missing from the SFX track (lost in the render): run mix.py again, report it if it repeats
2. pacing: nothing happens between 35.05s and 1:40.90 (65.9 s)
3. balance: sounds sit +9 dB over the original around them: they bury the voice/music, lower with --sfx-trim-db or --voice-safe

Listen to these 4 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.00s  'whoosh': the first sound of the film: the hook; also 'hit' at 0.05s: the quietest by perceived loudness among the sounds that are not ticks. Listen for: does it land with the picture at once, and is it clearly there under the music or the voice? / can it be heard at all?
  2.   15.95s  'pop': its peak sits -14 ms from the moment; its attack was moved 249 ms so that it lands on the moment. Listen for: does it feel early or late against the picture? / does the lead-in still read as part of the sound?
  3.   35.05s  'swoosh': brought 6 dB up to the perceived level of its role. Listen for: a thin recording lifted that far can turn harsh: is it clean?
  4.  1:40.90  'click': the highest peak of the film (-9 dBFS before the master). Listen for: is it big without hurting on headphones, and does the music under it pump?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).
