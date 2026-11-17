# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.00s |
| sync | 9.1 | 27/30 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 34 cues for 35 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 10.0 | 5.4 weighted events per 10 s, longest silence 3.2 s |
| variety | 7.0 | 16 source recordings, 13 families in 19 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 20.4 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -4.9 dBTP |
| loudness | 10.0 | final -16.5 LUFS (the author's own balance is kept) |
| balance | 10.0 | median event peak -9 dB vs the original around it, big sounds +4 dB (whole-track gap +15 LU) (27 event(s) on speech left to the speech axis) |
| audibility | 6.3 | 9 of 34 sounds sit more than 30 dB under the film's own sound in the mix (median -23 dB, after the ducking) |
| speech | 8.5 | 1 sound(s) in 1 moment(s) are within 3 dB of the voice or above it (1 above) even after ducking |
| low_end | 7.0 | 2 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.0 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 34 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 6.3 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. speech: 1 sound(s) around 16.73s ('pop' +6.0 dB vs the voice); lower them, shorten them, move into a pause (--voice-depth deep ducks by about 24 dB in speech: check the LUFS of *_sfx_ducked.wav before you use it)
2. variety: 4 takes of the same recording family 'mouse click' (1.10s, 4.86s, 16.13s, 23.44s); mix in other sounds
3. audibility: 9 sounds (click) are 30+ dB under the film's own sound in the mix: they cannot be heard. The ducking took them out: --voice-depth light (or normal), or a higher gain_db on those

Listen to these 5 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.00s  'whoosh': the first sound of the film: the hook; also 'sub_drop' at 0.02s: the highest peak of the film (-10 dBFS before the master). Listen for: does it land with the picture at once, and is it clearly there under the music or the voice? / is it big without hurting on headphones, and does the music under it pump?
  2.    9.73s  'pop': its peak sits -14 ms from the moment; its attack was moved 249 ms so that it lands on the moment. Listen for: does it feel early or late against the picture? / does the lead-in still read as part of the sound?
  3.   14.93s  'pop': its peak sits -14 ms from the moment. Listen for: does it feel early or late against the picture?
  4.   16.73s  'pop': 1 sound(s) on top of the voice, +6.0 dB against it. Listen for: is every word still understood?
  5.   27.80s  'swoosh': the quietest by perceived loudness among the sounds that are not ticks. Listen for: can it be heard at all?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).
