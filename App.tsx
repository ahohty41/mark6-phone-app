import React, { useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ImageBackground
} from 'react-native';
import { Ball } from './src/components/Ball';
import { generateMarkSixNumbers } from './src/utils/lotteryUtils';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  const [currentNumbers, setCurrentNumbers] = useState<number[]>([]);

  const handleGenerate = useCallback(() => {
    const newNumbers = generateMarkSixNumbers();
    setCurrentNumbers(newNumbers);
  }, []);

  const ballList = useMemo(() => {
    return currentNumbers.map((num) => (
      <Ball key={num} number={num} />
    ));
  }, [currentNumbers]);

  return (
    <View style={styles.fullScreen}>
      <StatusBar barStyle="light-content" />

      {/* 模擬絲綢質感背景 */}
      <View style={styles.silkBackground}>
        <SafeAreaView style={styles.container}>

          {/* Header Section */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.goldIconButton}>
              <Ionicons name="menu" size={24} color="#fcd34d" />
            </TouchableOpacity>

            <View style={styles.fortuneMode}>
              <Ionicons name="sparkles" size={16} color="#fcd34d" />
              <Text style={styles.fortuneText}>Fortune Mode</Text>
              <View style={styles.switchStub} />
            </View>

            <TouchableOpacity style={styles.goldIconButton}>
              <Ionicons name="settings-outline" size={24} color="#fcd34d" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Title Section */}
            <View style={styles.titleContainer}>
              <Text style={styles.mainTitle}>香港六合彩</Text>
              <View style={styles.titleUnderline} />
              <Text style={styles.subTitle}>TRADITIONAL FORTUNE GENERATOR</Text>
            </View>

            {/* Jackpot Card */}
            <View style={styles.jackpotCard}>
              <View style={styles.jackpotContent}>
                <Text style={styles.jackpotLabel}>NEXT JACKPOT ESTIMATE</Text>
                <Text style={styles.jackpotValue}>
                  <Text style={styles.goldSymbol}>$</Text> 88,000,000
                </Text>
              </View>
              <View style={styles.jackpotIcon}>
                <MaterialCommunityIcons name="currency-usd" size={30} color="white" />
              </View>
              {/* 四角金邊 */}
              <View style={[styles.corner, styles.tl]} />
              <View style={[styles.corner, styles.tr]} />
              <View style={[styles.corner, styles.bl]} />
              <View style={[styles.corner, styles.br]} />
            </View>

            {/* Lanterns Display Area */}
            <View style={styles.lanternArea}>
              {currentNumbers.length > 0 ? (
                <View style={styles.lanternGrid}>{ballList}</View>
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>誠心求籤，必有後福</Text>
                </View>
              )}
            </View>

            <Text style={styles.timeText}>Auspicious Time: Today, 12:47 PM</Text>

            {/* Generate Button */}
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGenerate}
              activeOpacity={0.8}
            >
              <View style={styles.buttonInner}>
                <MaterialCommunityIcons name="brush" size={24} color="#fcd34d" style={styles.brushIcon} />
                <Text style={styles.buttonText}>求籤 (Generate)</Text>
              </View>
            </TouchableOpacity>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
              <TouchableOpacity style={styles.navItem}>
                <MaterialCommunityIcons name="history" size={20} color="#fcd34d" opacity={0.6} />
                <Text style={styles.navText}>History</Text>
              </TouchableOpacity>
              <View style={styles.navDivider} />
              <TouchableOpacity style={styles.navItem}>
                <MaterialCommunityIcons name="chart-bell-curve" size={20} color="#fcd34d" opacity={0.6} />
                <Text style={styles.navText}>Analysis</Text>
              </TouchableOpacity>
              <View style={styles.navDivider} />
              <TouchableOpacity style={styles.navItem}>
                <Ionicons name="options-outline" size={20} color="#fcd34d" opacity={0.6} />
                <Text style={styles.navText}>Settings</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#7f1d1d',
  },
  silkBackground: {
    flex: 1,
    backgroundColor: '#450a0a', // 深紅/黑背景
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  goldIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  fortuneMode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(69, 10, 10, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)',
  },
  fortuneText: {
    color: '#fcd34d',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
    marginRight: 8,
  },
  switchStub: {
    width: 30,
    height: 16,
    backgroundColor: '#7f1d1d',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#fcd34d',
    textShadowColor: 'rgba(212, 175, 55, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  titleUnderline: {
    width: '80%',
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
    marginVertical: 10,
  },
  subTitle: {
    fontSize: 10,
    color: '#fcd34d',
    letterSpacing: 3,
    opacity: 0.8,
  },
  jackpotCard: {
    width: '90%',
    backgroundColor: 'rgba(69, 10, 10, 0.9)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  jackpotContent: {
    flex: 1,
  },
  jackpotLabel: {
    fontSize: 10,
    color: 'rgba(252, 211, 77, 0.7)',
    letterSpacing: 1,
    marginBottom: 5,
  },
  jackpotValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  goldSymbol: {
    color: '#fcd34d',
  },
  jackpotIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#b45309',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  corner: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderColor: '#d4af37',
  },
  tl: { top: 5, left: 5, borderTopWidth: 2, borderLeftWidth: 2 },
  tr: { top: 5, right: 5, borderTopWidth: 2, borderRightWidth: 2 },
  bl: { bottom: 5, left: 5, borderBottomWidth: 2, borderLeftWidth: 2 },
  br: { bottom: 5, right: 5, borderBottomWidth: 2, borderRightWidth: 2 },
  lanternArea: {
    width: '100%',
    minHeight: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  lanternGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  placeholder: {
    opacity: 0.5,
  },
  placeholderText: {
    color: '#fcd34d',
    fontSize: 18,
    fontStyle: 'italic',
  },
  timeText: {
    fontSize: 10,
    color: 'rgba(252, 211, 77, 0.5)',
    marginTop: 20,
    marginBottom: 30,
  },
  generateButton: {
    width: '90%',
    height: 65,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.7)',
  },
  buttonInner: {
    flex: 1,
    backgroundColor: '#b91c1c',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fcd34d',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  brushIcon: {
    marginRight: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  navText: {
    fontSize: 10,
    color: 'rgba(252, 211, 77, 0.5)',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  navDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
});
