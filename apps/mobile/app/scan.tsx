import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, { FadeIn, FadeOut, ZoomIn, SlideInDown } from "react-native-reanimated";
import { uploadImage, analyzeSkin } from "../src/lib/api";
import { useScanStore } from "../src/stores/scan";
import { useAuthStore } from "../src/stores/auth";
import { COLORS, SHADOWS } from "../src/constants/theme";
import { hapticMedium, hapticSuccess } from "../src/lib/haptics";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { addScan, refreshAll } = useScanStore();
  const { user } = useAuthStore();

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-bg justify-center items-center px-8">
        <Animated.View entering={ZoomIn.duration(600).springify()} className="w-20 h-20 rounded-[24px] items-center justify-center mb-6" style={{ backgroundColor: COLORS.primarySubtle }}>
          <Ionicons name="camera" size={36} color={COLORS.primary} />
        </Animated.View>
        <Animated.Text entering={FadeIn.delay(200).duration(500)} className="text-text text-2xl font-bold mb-2">Camera Access</Animated.Text>
        <Animated.Text entering={FadeIn.delay(300).duration(500)} className="text-text-tertiary text-center text-[17px] leading-6 mb-8">SkinMinder needs camera access to analyze your skin with AI precision.</Animated.Text>
        <TouchableOpacity className="px-10 py-4 rounded-[16px]" style={{ backgroundColor: COLORS.primary }} onPress={requestPermission}>
          <Text className="text-black font-semibold text-[17px]">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pickFromLibrary = async () => {
    hapticMedium();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    setAnalyzing(true);
    hapticMedium();

    try {
      const imageUrl = await uploadImage(capturedImage);
      const result = await analyzeSkin(imageUrl, { user_id: user?.id, source: "mobile" });
      setAnalysisResult(result);
      if (result.scan) {
        addScan(result.scan);
        if (user?.id) refreshAll(user.id);
      }
      hapticSuccess();
    } catch (error: any) {
      Alert.alert("Analysis Failed", error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetScan = () => {
    hapticMedium();
    setCapturedImage(null);
    setAnalysisResult(null);
  };

  if (analyzing) {
    return (
      <View className="flex-1 bg-bg justify-center items-center">
        <Animated.View entering={ZoomIn.duration(400)} className="w-20 h-20 rounded-full items-center justify-center mb-6" style={{ backgroundColor: COLORS.primarySubtle }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </Animated.View>
        <Animated.Text entering={FadeIn.delay(200)} className="text-text text-xl font-bold">Analyzing your skin</Animated.Text>
        <Animated.Text entering={FadeIn.delay(400)} className="text-text-tertiary mt-2">AI is processing 6 skin dimensions...</Animated.Text>
      </View>
    );
  }

  if (analysisResult) {
    const scan = analysisResult.scan || {};
    return (
      <View className="flex-1 bg-bg">
        <View className="px-6 pt-16">
          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-text text-[28px] font-bold tracking-tight">Results</Text>
            <TouchableOpacity onPress={resetScan}>
              <Ionicons name="close" size={26} color={COLORS.textTertiary} />
            </TouchableOpacity>
          </View>

          <Animated.View entering={SlideInDown.duration(500).springify()} className="rounded-[22px] p-6 mb-5" style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }}>
            <Text className="text-primary text-[15px] font-semibold mb-1 tracking-wide uppercase">Skin Archetype</Text>
            <Text className="text-text text-2xl font-bold mb-6">{analysisResult.dna?.archetype || "Analysis Complete"}</Text>
            <View className="gap-5">
              <ScoreRow label="Hydration" score={scan.hydration_score || 0} color={COLORS.scores.hydration} delay={0} />
              <ScoreRow label="Texture" score={scan.texture_score || 0} color={COLORS.scores.texture} delay={100} />
              <ScoreRow label="Pigment" score={scan.pigment_score || 0} color={COLORS.scores.pigment} delay={200} />
              <ScoreRow label="Pores" score={scan.pore_score || 0} color={COLORS.scores.pores} delay={300} />
              <ScoreRow label="Sensitivity" score={scan.sensitivity_score || 0} color={COLORS.scores.sensitivity} delay={400} />
              <ScoreRow label="Firmness" score={scan.firmness_score || 0} color={COLORS.scores.firmness} delay={500} />
            </View>
          </Animated.View>

          <Animated.View entering={SlideInDown.delay(600).duration(500).springify()} className="rounded-[22px] p-6 mb-5 items-center" style={{ backgroundColor: "rgba(201, 169, 110, 0.06)", borderColor: "rgba(201, 169, 110, 0.15)", borderWidth: 1 }}>
            <Text className="text-text-secondary text-[13px] uppercase tracking-wider mb-3">Overall Score</Text>
            <View className="w-[88px] h-[88px] rounded-full items-center justify-center" style={{ backgroundColor: "rgba(201, 169, 110, 0.12)" }}>
              <Text className="text-[36px] font-bold text-primary">{scan.overall_score || 0}</Text>
            </View>
          </Animated.View>

          <View className="gap-3 mb-8">
            <TouchableOpacity className="py-4 rounded-[16px] items-center" style={{ backgroundColor: COLORS.primary }} onPress={() => router.push("/dashboard")}>
              <Text className="text-black font-semibold text-[17px]">View Full Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity className="py-4 rounded-[16px] items-center" style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }} onPress={resetScan}>
              <Text className="text-text-secondary font-semibold text-[17px]">New Scan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg">
      <View className="px-6 pt-16">
        <Text className="text-text text-[28px] font-bold tracking-tight mb-8">Skin Analysis</Text>

        {!capturedImage ? (
          <View className="gap-4">
            <TouchableOpacity className="rounded-[22px] p-10 items-center" style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1, borderStyle: "dashed" as any }} onPress={() => setCameraActive(true)}>
              <View className="w-16 h-16 rounded-[20px] items-center justify-center mb-4" style={{ backgroundColor: COLORS.primarySubtle }}>
                <Ionicons name="camera" size={32} color={COLORS.primary} />
              </View>
              <Text className="text-text text-[17px] font-semibold mb-1">Take Photo</Text>
              <Text className="text-text-tertiary text-[15px]">Use camera for live analysis</Text>
            </TouchableOpacity>

            <TouchableOpacity className="rounded-[22px] p-10 items-center" style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }} onPress={pickFromLibrary}>
              <View className="w-16 h-16 rounded-[20px] items-center justify-center mb-4" style={{ backgroundColor: "rgba(96, 165, 250, 0.1)" }}>
                <Ionicons name="images" size={32} color={COLORS.info} />
              </View>
              <Text className="text-text text-[17px] font-semibold mb-1">Choose from Library</Text>
              <Text className="text-text-tertiary text-[15px]">Upload an existing photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Image source={{ uri: capturedImage }} className="w-full rounded-[22px] mb-5" style={{ aspectRatio: 1 }} />
            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 py-4 rounded-[16px] items-center" style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }} onPress={resetScan}>
                <Text className="text-text-secondary font-semibold text-[17px]">Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 py-4 rounded-[16px] items-center" style={{ backgroundColor: COLORS.primary }} onPress={handleAnalyze}>
                <Text className="text-black font-semibold text-[17px]">Analyze</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {cameraActive && (
        <Animated.View entering={FadeIn.duration(300)} className="absolute inset-0">
          <CameraView style={{ flex: 1 }} facing="front">
            <View className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
              <View className="flex-1 justify-center items-center">
                <View className="w-[280px] h-[280px] rounded-[32px]" style={{ borderWidth: 2, borderColor: "rgba(255,255,255,0.3)" }} />
              </View>
              <View className="absolute bottom-16 left-0 right-0 items-center">
                <TouchableOpacity className="w-[72px] h-[72px] rounded-full items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.9)" }} onPress={() => setCameraActive(false)}>
                  <View className="w-[60px] h-[60px] rounded-full" style={{ backgroundColor: COLORS.primary }} />
                </TouchableOpacity>
                <TouchableOpacity className="absolute right-12 bottom-2" onPress={() => setCameraActive(false)}>
                  <Ionicons name="close" size={30} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        </Animated.View>
      )}
    </View>
  );
}

function ScoreRow({ label, score, color, delay }: { label: string; score: number; color: string; delay: number }) {
  const [width, setWidth] = useState(0);

  return (
    <View>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-text-secondary text-[15px]">{label}</Text>
        <Text className="text-[15px] font-semibold" style={{ color }}>{score}</Text>
      </View>
      <View className="h-[6px] rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
        <Animated.View
          entering={FadeIn.delay(delay).duration(800)}
          className="h-full rounded-full"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </View>
    </View>
  );
}
