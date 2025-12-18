import { useThemeColors } from "@/constants/theme";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { CheckCircleIcon, WarningCircleIcon } from "phosphor-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const QrScanner = () => {
     const [showScanner, setShowScanner] = React.useState(false);
      const [scannedData, setScannedData] = useState<string | null>(null);
      const [permission, requestPermission] = useCameraPermissions();
        const themeprovider = useThemeColors();
    
    return(
        
        <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "#000000",
                    zIndex: 1000,
                  }}
                >
                  <SafeAreaView style={{ flex: 1 }}>
                    {/* Header */}
                    <View
                      style={{
                        paddingHorizontal: 24,
                        paddingVertical: 38,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.8)",
                      }}
                    >
                      <Text
                        style={{
                          color: "#ffffff",
                          fontSize: 20,
                          fontWeight: "800",
                        }}
                      >
                        Scan QR Code
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          if (router.canGoBack()) {
                            router.back();
                          }
                        }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: "rgba(255,255,255,0.1)",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "#ffffff",
                            fontSize: 20,
                            fontWeight: "600",
                          }}
                        >
                          ✕
                        </Text>
                      </TouchableOpacity>
                    </View>
        
                    {/* Camera View */}
                    <View style={{ flex: 1, position: "relative" }}>
                      {permission?.granted ? (
                        <>
                          <CameraView
                            style={{ flex: 1 }}
                            facing="back"
                            barcodeScannerSettings={{
                              barcodeTypes: ["qr"],
                            }}
                            onBarcodeScanned={(data) => {
                              if (!scannedData) {
                                setScannedData(data.data);
                              }
                            }}
                          />
        
                          {/* Scan Area Overlay */}
                          <View
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {/* Corner overlays */}
                            <View
                              style={{
                                width: 280,
                                height: 280,
                                position: "relative",
                              }}
                            >
                              {/* Top Left */}
                              <View
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: 40,
                                  height: 40,
                                  borderTopWidth: 4,
                                  borderLeftWidth: 4,
                                  borderColor: themeprovider.primary,
                                  borderTopLeftRadius: 8,
                                }}
                              />
                              {/* Top Right */}
                              <View
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  width: 40,
                                  height: 40,
                                  borderTopWidth: 4,
                                  borderRightWidth: 4,
                                  borderColor: themeprovider.primary,
                                  borderTopRightRadius: 8,
                                }}
                              />
                              {/* Bottom Left */}
                              <View
                                style={{
                                  position: "absolute",
                                  bottom: 0,
                                  left: 0,
                                  width: 40,
                                  height: 40,
                                  borderBottomWidth: 4,
                                  borderLeftWidth: 4,
                                  borderColor: themeprovider.primary,
                                  borderBottomLeftRadius: 8,
                                }}
                              />
                              {/* Bottom Right */}
                              <View
                                style={{
                                  position: "absolute",
                                  bottom: 0,
                                  right: 0,
                                  width: 40,
                                  height: 40,
                                  borderBottomWidth: 4,
                                  borderRightWidth: 4,
                                  borderColor: themeprovider.primary,
                                  borderBottomRightRadius: 8,
                                }}
                              />
                            </View>
                          </View>
        
                          {/* Instructions */}
                          <View
                            style={{
                              position: "absolute",
                              bottom: 100,
                              left: 0,
                              right: 0,
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: "rgba(0,0,0,0.7)",
                                paddingHorizontal: 24,
                                paddingVertical: 16,
                                borderRadius: 16,
                              }}
                            >
                              <Text
                                style={{
                                  color: "#ffffff",
                                  fontSize: 15,
                                  fontWeight: "600",
                                  textAlign: "center",
                                }}
                              >
                                Position QR code within the frame
                              </Text>
                            </View>
                          </View>
        
                          {/* Scanned Result */}
                          {scannedData && (
                            <View
                              style={{
                                position: "absolute",
                                bottom: 30,
                                left: 0,
                                right: 0,
                                backgroundColor: themeprovider.card,
                                padding: 24,
                                borderTopLeftRadius: 32,
                                borderTopRightRadius: 32,
                              }}
                            >
                              <View
                                style={{
                                  marginBottom: 20,
                                }}
                              >
                                <View
                                  style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 30,
                                    backgroundColor: `${themeprovider.primary}20`,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginBottom: 16,
                                    alignSelf: "center",
                                  }}
                                >
                                  <CheckCircleIcon
                                    color={themeprovider.primary}
                                    size={32}
                                    weight="fill"
                                  />
                                </View>
                                <Text
                                  style={{
                                    color: themeprovider.text,
                                    fontSize: 20,
                                    fontWeight: "800",
                                    textAlign: "center",
                                    marginBottom: 8,
                                  }}
                                >
                                  QR Code Scanned
                                </Text>
                                <Text
                                  style={{
                                    color: themeprovider.txtsec,
                                    fontSize: 14,
                                    fontWeight: "500",
                                    textAlign: "center",
                                    marginBottom: 16,
                                  }}
                                >
                                  {scannedData}
                                </Text>
                              </View>
                              <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {
                                  setShowScanner(false);
                                  setScannedData(null);
                                }}
                                style={{
                                  backgroundColor: themeprovider.primary,
                                  paddingVertical: 16,
                                  borderRadius: 16,
                                  marginBottom: 8,
                                }}
                              >
                                <Text
                                  style={{
                                    color: "#ffffff",
                                    fontSize: 16,
                                    fontWeight: "700",
                                    textAlign: "center",
                                  }}
                                >
                                  Done
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => setScannedData(null)}
                                style={{
                                  paddingVertical: 12,
                                }}
                              >
                                <Text
                                  style={{
                                    color: themeprovider.primary,
                                    fontSize: 15,
                                    fontWeight: "700",
                                    textAlign: "center",
                                  }}
                                >
                                  Scan Another
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </>
                      ) : (
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            paddingHorizontal: 40,
                          }}
                        >
                          <WarningCircleIcon color="#F59E0B" size={64} weight="fill" />
                          <Text
                            style={{
                              color: "#ffffff",
                              fontSize: 20,
                              fontWeight: "700",
                              marginTop: 20,
                              marginBottom: 12,
                              textAlign: "center",
                            }}
                          >
                            Camera Permission Required
                          </Text>
                          <Text
                            style={{
                              color: "rgba(255,255,255,0.7)",
                              fontSize: 15,
                              fontWeight: "500",
                              textAlign: "center",
                              marginBottom: 32,
                            }}
                          >
                            Please grant camera access to scan QR codes
                          </Text>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={requestPermission}
                            style={{
                              backgroundColor: themeprovider.primary,
                              paddingHorizontal: 32,
                              paddingVertical: 16,
                              borderRadius: 16,
                            }}
                          >
                            <Text
                              style={{
                                color: "#ffffff",
                                fontSize: 16,
                                fontWeight: "700",
                              }}
                            >
                              Grant Permission
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </SafeAreaView>
                </View>
    );
};

export default QrScanner;