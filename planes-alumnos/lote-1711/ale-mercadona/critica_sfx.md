# Critique, round 1

| axis | score | basis |
|---|---|---|
| hook | 10.0 | first sound at 0.00s |
| sync | 8.9 | 7/8 sounds on their frame (peaks, arrivals, or first onsets for clicks) |
| coverage | n/a | 14 cues for 15 declared events (the list is the reference; runs and clusters are thinned on purpose) |
| pacing | 10.0 | 5.1 weighted events per 10 s, longest silence 3.4 s |
| variety | 10.0 | 10 source recordings, 9 families in 10 sounds (runs and interface sounds not counted) |
| hierarchy | 10.0 | 14.2 dB between the loud and the quiet sounds |
| headroom | 10.0 | true peak -4.9 dBTP |
| loudness | 10.0 | final -16.5 LUFS (the author's own balance is kept) |
| balance | 7.0 | median event peak +2 dB vs the original around it, big sounds +5 dB (whole-track gap +10 LU) (3 event(s) on speech left to the speech axis) |
| audibility | 7.0 | 3 of 14 sounds sit more than 30 dB under the film's own sound in the mix (median +1 dB, after the ducking) |
| speech | 10.0 | 0 sound(s) in 0 moment(s) are within 3 dB of the voice or above it (0 above) even after ducking |
| low_end | 7.0 | 2 heavy sound(s) on top of existing bass |
| mono | 10.0 | the SFX track loses 0.0 dB when folded to mono (0 = the channels agree, 3 = unrelated, 6+ = parts cancel); 0 of 14 sounds lose more than 6 dB; the film loses 0.0 LU in mono against 0.0 LU for the original (+0.0 added) |

**FIX**: lowest axis 7.0 (every axis must reach 8; ok to show)

Three worst problems, fix only these, re-render, run again:
1. balance: sounds sit +5 dB over the original around them: they bury the voice/music, lower with --sfx-trim-db or --voice-safe
2. audibility: 3 sounds (click) are 30+ dB under the film's own sound in the mix: they cannot be heard. The ducking took them out: --voice-depth light (or normal), or a higher gain_db on those
3. low end: 'sub_drop' at 0.02s piles onto the bass already there (-33 dB); lower it 25 dB, highpass >= 140 Hz (the check measures 30-140 Hz: 90 Hz is not enough), or drop its sub layer

Listen to these 2 moments, on headphones and then once on a phone speaker. This script cannot hear: they are the places where the numbers above are least certain, and none of them says that it sounds good:
  1.    0.00s  'whoosh': the first sound of the film: the hook; also '' at 0.50s: the busiest two seconds (5 sounds). Listen for: does it land with the picture at once, and is it clearly there under the music or the voice? / is every sound still distinct, or does it turn to mud?
  2.   10.78s  'riser': its peak sits -35 ms from the moment; also 'swoosh' at 10.78s: brought 6 dB up to the perceived level of its role. Listen for: does it feel early or late against the picture? / a thin recording lifted that far can turn harsh: is it clean?
  (--listen-out FILE.wav cuts them into one file of the film's own sound)

Still to judge by eye on review.png: character fit (each sound suits its picture), cleanliness (no mud in the low end under music/voice, nothing masks speech), taste (designed, not sprayed on).
