import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { uploadImage, analyzeSkin } from "../src/lib/api";
import { useScanStore } from "../src/stores/scan";
import { useAuthStore } from "../src/stores/auth";

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
      <View className="flex-1 bg-surface justify-center items-center px-8">
        <Ionicons name="camera" size={64} color="#a18b6f" />
        <Text className="text-white text-xl font-bold mt-6">Camera Access Needed</Text>
        <Text className="text-gray-400 text-center mt-2">
          SkinMinder needs camera access to analyze your skin.
        </Text>
        <TouchableOpacity
          className="bg-primary-500 rounded-xl px-8 py-3 mt-6"
          onPress={requestPermission}
        >
          <Text className="text-surface font-semibold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pickFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    setAnalyzing(true);

    try {
      const imageUrl = await uploadImage(capturedImage);
      const result = await analyzeSkin(imageUrl, {
        user_id: user?.id,
        source: "mobile",
      });

      setAnalysisResult(result);
      if (result.scan) {
        addScan(result.scan);
        if (user?.id) refreshAll(user.id);
      }
    } catch (error: any) {
      Alert.alert("Analysis Failed", error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetScan = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
  };

  if (analyzing) {
    return (
      <View className="flex-1 bg-surface justify-center items-center">
        <ActivityIndicator size="large" color="#a18b6f" />
        <Text className="text-white text-lg mt-4">Analyzing your skin...</Text>
        <Text className="text-gray-500 mt-2">This may take a few seconds</Text>
      </View>
    );
  }

  if (analysisResult) {
    return (
      <View className="flex-1 bg-surface">
        <View className="px-6 pt-14">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-white text-2xl font-bold">Results</Text>
            <TouchableOpacity onPress={resetScan}>
              <Ionicons name="close" size={28} color="#666" />
            </TouchableOpacity>
          </View>

          <View className="bg-surface-card rounded-2xl p-5 mb-4 border border-surface-border">
            <Text className="text-primary-500 font-semibold text-lg mb-3">
              {analysisResult.dna?.archetype || "Skin Analysis"}
            </Text>
            <View className="gap-3">
              <ScoreBar label="Hydration" score={analysisResult.scan?.hydration_score || 0} color="#4fc3f7" />
              <ScoreBar label="Texture" score={analysisResult.scan?.texture_score || 0} color="#81c784" />
              <ScoreBar label="Pigment" score={analysisResult.scan?.pigment_score || 0} color="#ffb74d" />
              <ScoreBar label="Pores" score={analysisResult.scan?.pore_score || 0} color="#ce93d8" />
              <ScoreBar label="Sensitivity" score={analysisResult.scan?.sensitivity_score || 0} color="#ef5350" />
              <ScoreBar label="Firmness" score={analysisResult.scan?.firmness_score || 0} color="#4dd0e1" />
            </View>
          </View>

          <View className="bg-surface-card rounded-2xl p-5 mb-4 border border-surface-border">
            <Text className="text-white font-semibold mb-2">Overall Score</Text>
            <View className="items-center">
              <View className="w-24 h-24 rounded-full bg-primary-500/20 items-center justify-center">
                <Text className="text-3xl font-bold text-primary-500">
                  {analysisResult.scan?.overall_score || 0}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            className="bg-primary-500 rounded-xl py-4 items-center mb-3"
            onPress={() => router.push("/dashboard")}
          >
            <Text className="text-surface font-semibold text-lg">View Full Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-surface-card border border-surface-border rounded-xl py-4 items-center"
            onPress={resetScan}
          >
            <Text className="text-gray-300 font-semibold">New Scan</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      <View className="px-6 pt-14 pb-6">
        <Text className="text-white text-2xl font-bold mb-6">Skin Analysis</Text>

        {!capturedImage ? (
          <View className="gap-4">
            <TouchableOpacity
              className="bg-surface-card rounded-2xl p-8 items-center border border-surface-border border-dashed"
              onPress={() => setCameraActive(true)}
            >
              <Ionicons name="camera" size={48} color="#a18b6f" />
              <Text className="text-white font-semibold mt-3">Take Photo</Text>
              <Text className="text-gray-500 text-sm mt-1">Use camera for live analysis</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-surface-card rounded-2xl p-8 items-center border border-surface-border"
              onPress={pickFromLibrary}
            >
              <Ionicons name="images" size={48} color="#a18b6f" />
              <Text className="text-white font-semibold mt-3">Choose from Library</Text>
              <Text className="text-gray-500 text-sm mt-1">Upload an existing photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Image
              source={{ uri: capturedImage }}
              className="w-full aspect-square rounded-2xl mb-4"
            />
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-surface-card border border-surface-border rounded-xl py-4 items-center"
                onPress={resetScan}
              >
                <Text className="text-gray-300 font-semibold">Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-primary-500 rounded-xl py-4 items-center"
                onPress={handleAnalyze}
              >
                <Text className="text-surface font-semibold">Analyze</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {cameraActive && (
        <View className="absolute inset-0">
          <CameraView
            style={{ flex: 1 }}
            facing="front"
            onCapture={(photo) => {
              setCapturedImage(photo.uri);
              setCameraActive(false);
            }}
          >
            <View className="absolute bottom-0 left-0 right-0 p-8 items-center">
              <TouchableOpacity
                className="w-20 h-20 rounded-full bg-white items-center justify-center"
                onPress={() => {
                  // Capture handled by CameraView
                }}
              >
                <View className="w-16 h-16 rounded-full bg-primary-500" />
              </TouchableOpacity>
              <TouchableOpacity
                className="absolute right-8 bottom-4"
                onPress={() => setCameraActive(false)}
              >
                <Ionicons name="close" size={32} color="white" />
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      )}
    </View>
  );
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <View>
      <View className="flex-row justify-between mb-1">
        <Text className="text-gray-300 text-sm">{label}</Text>
        <Text className="text-sm font-semibold" style={{ color }}>{score}</Text>
      </View>
      <View className="h-2 bg-surface-border rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </View>
    </View>
  );
}
