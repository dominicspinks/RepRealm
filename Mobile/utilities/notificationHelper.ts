import { AudioPlayer, useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";

export function useNotificationSounds() {
    const playerLongBeep = useAudioPlayer(require("../assets/sounds/beep-long.mp3"));

    return { playerLongBeep };
}

export function playBeep(playerLongBeep: AudioPlayer | null) {
    if (playerLongBeep) {
        playerLongBeep.seekTo(0);
        playerLongBeep.play();
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
