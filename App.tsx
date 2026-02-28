import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ball } from './src/components/Ball';
import { generateMarkSixNumbers } from './src/utils/lotteryUtils';
import { generateZodiacNumbers, ZODIAC_LIST, HOUR_LIST, Zodiac, ChineseHour } from './src/utils/zodiacUtils';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ApiResponse, HistoryEntry, MarkSixResult, FavoriteEntry } from './src/types/lottery';
import { HistoryModal } from './src/components/HistoryModal';
import { AnalysisModal } from './src/components/AnalysisModal';
import { FavoriteModal } from './src/components/FavoriteModal';
import { SettingsModal } from './src/components/SettingsModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageProvider, useTranslation } from './src/i18n/LanguageContext';

// TODO: 部署後改為正式 Vercel URL
const API_URL = 'http://192.168.31.204:3000/api';

const formatJackpot = (amount: number): string => {
  return amount.toLocaleString();
};

const formatDrawDate = (dateStr: string): string => {
  return dateStr.split(/[T+]/)[0];
};

function AppContent() {
  const { t } = useTranslation();
  const [currentNumbers, setCurrentNumbers] = useState<number[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [analysisVisible, setAnalysisVisible] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [favoriteVisible, setFavoriteVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [lastDraw, setLastDraw] = useState<MarkSixResult | null>(null);
  const [jackpot, setJackpot] = useState<number | null>(null);
  const [drawLoading, setDrawLoading] = useState(true);
  const [mode, setMode] = useState<'random' | 'zodiac'>('random');
  const [selectedZodiac, setSelectedZodiac] = useState<Zodiac>('rat');
  const [selectedHour, setSelectedHour] = useState<ChineseHour>('zi');

  useEffect(() => {
    const loadStored = async () => {
      try {
        const [storedFav, storedZodiac, storedHour] = await Promise.all([
          AsyncStorage.getItem('favorites'),
          AsyncStorage.getItem('zodiac'),
          AsyncStorage.getItem('hour'),
        ]);
        if (storedFav) {
          const parsed: FavoriteEntry[] = JSON.parse(storedFav, (key, value) =>
            key === 'timestamp' ? new Date(value) : value,
          );
          setFavorites(parsed);
        }
        if (storedZodiac) setSelectedZodiac(storedZodiac as Zodiac);
        if (storedHour) setSelectedHour(storedHour as ChineseHour);
      } catch {
        // Silently fail
      }
    };
    loadStored();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('favorites', JSON.stringify(favorites)).catch(() => {});
  }, [favorites]);

  useEffect(() => {
    const fetchDrawData = async () => {
      try {
        const response = await fetch(API_URL);
        const json: ApiResponse = await response.json();
        if (json.success && json.data) {
          setLastDraw(json.data);
          if (json.data.nextDraw?.estimatedJackpot) {
            setJackpot(json.data.nextDraw.estimatedJackpot);
          }
        }
      } catch {
        // Silently fail
      } finally {
        setDrawLoading(false);
      }
    };
    fetchDrawData();
  }, []);

  const handleGenerate = useCallback(() => {
    const newNumbers = mode === 'zodiac'
      ? generateZodiacNumbers(selectedZodiac, selectedHour)
      : generateMarkSixNumbers();
    setCurrentNumbers(newNumbers);
    setHistory((prev) => {
      const entry: HistoryEntry = {
        id: Date.now(),
        numbers: newNumbers,
        timestamp: new Date(),
      };
      const updated = [entry, ...prev];
      return updated.length > 10 ? updated.slice(0, 10) : updated;
    });
  }, [mode, selectedZodiac, selectedHour]);

  const handleSelectZodiac = useCallback((z: Zodiac) => {
    setSelectedZodiac(z);
    AsyncStorage.setItem('zodiac', z).catch(() => {});
  }, []);

  const handleSelectHour = useCallback((h: ChineseHour) => {
    setSelectedHour(h);
    AsyncStorage.setItem('hour', h).catch(() => {});
  }, []);

  const zodiacTranslationKey = useCallback((key: string): string => {
    const map: Record<string, string> = {
      rat: 'zodiacRat', ox: 'zodiacOx', tiger: 'zodiacTiger', rabbit: 'zodiacRabbit',
      dragon: 'zodiacDragon', snake: 'zodiacSnake', horse: 'zodiacHorse', goat: 'zodiacGoat',
      monkey: 'zodiacMonkey', rooster: 'zodiacRooster', dog: 'zodiacDog', pig: 'zodiacPig',
    };
    return map[key] || key;
  }, []);

  const hourTranslationKey = useCallback((key: string): string => {
    const map: Record<string, string> = {
      zi: 'hourZi', chou: 'hourChou', yin: 'hourYin', mao: 'hourMao',
      chen: 'hourChen', si: 'hourSi', wu: 'hourWu', wei: 'hourWei',
      shen: 'hourShen', you: 'hourYou', xu: 'hourXu', hai: 'hourHai',
    };
    return map[key] || key;
  }, []);

  const isFavorited = useMemo(() => {
    if (currentNumbers.length === 0) return false;
    const key = currentNumbers.join(',');
    return favorites.some((f) => f.numbers.join(',') === key);
  }, [currentNumbers, favorites]);

  const handleAddFavorite = useCallback(() => {
    if (currentNumbers.length === 0) return;
    const key = currentNumbers.join(',');
    const exists = favorites.some((f) => f.numbers.join(',') === key);
    if (exists) {
      setFavorites((prev) => prev.filter((f) => f.numbers.join(',') !== key));
    } else {
      setFavorites((prev) => [
        { id: Date.now(), numbers: [...currentNumbers], timestamp: new Date() },
        ...prev,
      ]);
    }
  }, [currentNumbers, favorites]);

  const handleRemoveFavorite = useCallback((id: number) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const favoriteKeys = useMemo(
    () => new Set(favorites.map((f) => f.numbers.join(','))),
    [favorites],
  );

  const handleToggleFavorite = useCallback((numbers: number[]) => {
    const key = numbers.join(',');
    setFavorites((prev) => {
      const exists = prev.some((f) => f.numbers.join(',') === key);
      if (exists) return prev.filter((f) => f.numbers.join(',') !== key);
      return [{ id: Date.now(), numbers: [...numbers], timestamp: new Date() }, ...prev];
    });
  }, []);

  const ballList = useMemo(() => {
    return currentNumbers.map((num) => (
      <Ball key={num} number={num} />
    ));
  }, [currentNumbers]);

  return (
    <View style={styles.fullScreen}>
      <StatusBar barStyle="light-content" />

      <View style={styles.silkBackground}>
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>

            {/* Header with Settings */}
            <View style={styles.header}>
              <View style={{ width: 40 }} />
              <View style={{ flex: 1 }} />
              <TouchableOpacity onPress={() => setSettingsVisible(true)}>
                <Ionicons name="settings-outline" size={24} color="#fcd34d" />
              </TouchableOpacity>
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.mainTitle}>{t('appTitle')}</Text>
              <View style={styles.titleUnderline} />
              <Text style={styles.subTitle}>{t('appSubtitle')}</Text>
            </View>

            {/* Last Draw Result Card */}
            {drawLoading ? (
              <ActivityIndicator color="#fcd34d" style={{ marginBottom: 16 }} />
            ) : lastDraw ? (
              <View style={styles.card}>
                <View style={[styles.corner, styles.tl]} />
                <View style={[styles.corner, styles.tr]} />
                <View style={[styles.corner, styles.bl]} />
                <View style={[styles.corner, styles.br]} />

                <Text style={styles.cardTitle}>{t('lastDraw')}</Text>
                <Text style={styles.cardSubtitle}>
                  {t('drawPrefix', { n: lastDraw.drawNumber })} · {formatDrawDate(lastDraw.drawDate)}
                </Text>

                <View style={styles.lastDrawBalls}>
                  {lastDraw.numbers.map((num, i) => (
                    <Ball key={`last-${num}-${i}`} number={Number(num)} size="small" />
                  ))}
                  <Text style={styles.lastDrawPlus}>+</Text>
                  <Ball key="extra" number={Number(lastDraw.extraNumber)} size="small" />
                </View>
              </View>
            ) : null}

            {/* Jackpot Card */}
            <View style={styles.card}>
              <View style={[styles.corner, styles.tl]} />
              <View style={[styles.corner, styles.tr]} />
              <View style={[styles.corner, styles.bl]} />
              <View style={[styles.corner, styles.br]} />

              <Text style={styles.jackpotLabel}>{t('jackpotEstimate')}</Text>
              {drawLoading ? (
                <ActivityIndicator color="#fcd34d" style={{ marginTop: 6 }} />
              ) : (
                <View style={styles.jackpotRow}>
                  <Text style={styles.jackpotIcon}>💰</Text>
                  <Text style={styles.jackpotValue}>
                    <Text style={styles.goldSymbol}>$</Text>{' '}
                    {jackpot ? formatJackpot(jackpot) : '---'}
                  </Text>
                </View>
              )}
            </View>

            {/* Generated Numbers Section */}
            <View style={styles.sectionRow}>
              <Text style={styles.sectionLabel}>{t('currentGenerated')}</Text>
              <TouchableOpacity onPress={handleAddFavorite} style={styles.starButton}>
                <Ionicons
                  name={isFavorited ? 'star' : 'star-outline'}
                  size={22}
                  color="#fcd34d"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.lanternArea}>
              {currentNumbers.length > 0 ? (
                <View style={styles.lanternGrid}>
                  {ballList}
                </View>
              ) : (
                <View style={styles.placeholderBalls} />
              )}
            </View>

            {/* Fortune Text */}
            <Text style={styles.fortuneText}>{t('fortuneText')}</Text>
            <Text style={styles.timeText}>Today, 12:47 PM</Text>

            {/* Mode Toggle */}
            <View style={styles.modeToggle}>
              <TouchableOpacity
                style={[styles.modeTab, mode === 'random' && styles.modeTabActive]}
                onPress={() => setMode('random')}
              >
                <Text style={[styles.modeTabText, mode === 'random' && styles.modeTabTextActive]}>
                  {t('modeRandom')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeTab, mode === 'zodiac' && styles.modeTabActive]}
                onPress={() => setMode('zodiac')}
              >
                <Text style={[styles.modeTabText, mode === 'zodiac' && styles.modeTabTextActive]}>
                  {t('modeFortune')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Zodiac Selector (visible in zodiac mode) */}
            {mode === 'zodiac' && (
              <View style={styles.zodiacCard}>
                <Text style={styles.zodiacSectionLabel}>{t('yourZodiac')}</Text>
                <View style={styles.zodiacGrid}>
                  {ZODIAC_LIST.map((z) => (
                    <TouchableOpacity
                      key={z.key}
                      style={[
                        styles.zodiacItem,
                        selectedZodiac === z.key && styles.zodiacItemActive,
                      ]}
                      onPress={() => handleSelectZodiac(z.key)}
                    >
                      <Text style={styles.zodiacEmoji}>{z.emoji}</Text>
                      <Text style={[
                        styles.zodiacLabel,
                        selectedZodiac === z.key && styles.zodiacLabelActive,
                      ]}>
                        {t(zodiacTranslationKey(z.key))}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.zodiacSectionLabel, { marginTop: 14 }]}>{t('birthHour')}</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.hourScroll}
                >
                  {HOUR_LIST.map((h) => (
                    <TouchableOpacity
                      key={h.key}
                      style={[
                        styles.hourPill,
                        selectedHour === h.key && styles.hourPillActive,
                      ]}
                      onPress={() => handleSelectHour(h.key)}
                    >
                      <Text style={[
                        styles.hourPillText,
                        selectedHour === h.key && styles.hourPillTextActive,
                      ]}>
                        {t(hourTranslationKey(h.key))}
                      </Text>
                      <Text style={styles.hourPillTime}>{h.time}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Generate Button */}
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGenerate}
              activeOpacity={0.8}
            >
              <View style={styles.buttonInner}>
                <MaterialCommunityIcons name="brush" size={22} color="#fcd34d" style={styles.brushIcon} />
                <Text style={styles.buttonText}>{t('generate')}</Text>
              </View>
            </TouchableOpacity>

          </ScrollView>

          {/* Fixed Bottom Navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem} onPress={() => setHistoryVisible(true)}>
              <MaterialCommunityIcons name="history" size={24} color="#fcd34d" />
              <Text style={styles.navText}>{t('history')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => setAnalysisVisible(true)}>
              <MaterialCommunityIcons name="chart-bell-curve" size={24} color="#fcd34d" />
              <Text style={styles.navText}>{t('analysis')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => setFavoriteVisible(true)}>
              <Ionicons name="star-outline" size={24} color="#fcd34d" />
              <Text style={styles.navText}>{t('favorite')}</Text>
            </TouchableOpacity>
          </View>

        </SafeAreaView>
      </View>

      <HistoryModal
        visible={historyVisible}
        history={history}
        favoriteKeys={favoriteKeys}
        onClose={() => setHistoryVisible(false)}
        onToggleFavorite={handleToggleFavorite}
      />
      <AnalysisModal
        visible={analysisVisible}
        apiBaseUrl={API_URL}
        onClose={() => setAnalysisVisible(false)}
      />
      <FavoriteModal
        visible={favoriteVisible}
        favorites={favorites}
        onClose={() => setFavoriteVisible(false)}
        onRemove={handleRemoveFavorite}
      />
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </View>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#7f1d1d',
  },
  silkBackground: {
    flex: 1,
    backgroundColor: '#450a0a',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 16,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 4,
  },

  /* Title */
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 36,
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
    marginVertical: 6,
  },
  subTitle: {
    fontSize: 10,
    color: '#fcd34d',
    letterSpacing: 3,
    opacity: 0.8,
  },

  /* Shared Card Style */
  card: {
    width: '90%',
    backgroundColor: 'rgba(69, 10, 10, 0.9)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    marginBottom: 10,
    alignItems: 'center',
    position: 'relative',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fcd34d',
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'rgba(252, 211, 77, 0.6)',
    marginTop: 3,
    marginBottom: 8,
  },

  /* Gold Corners */
  corner: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderColor: '#d4af37',
  },
  tl: { top: 6, left: 6, borderTopWidth: 2, borderLeftWidth: 2 },
  tr: { top: 6, right: 6, borderTopWidth: 2, borderRightWidth: 2 },
  bl: { bottom: 6, left: 6, borderBottomWidth: 2, borderLeftWidth: 2 },
  br: { bottom: 6, right: 6, borderBottomWidth: 2, borderRightWidth: 2 },

  /* Last Draw Balls */
  lastDrawBalls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  lastDrawPlus: {
    color: '#fcd34d',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 2,
  },

  /* Jackpot */
  jackpotLabel: {
    fontSize: 13,
    color: 'rgba(252, 211, 77, 0.8)',
    letterSpacing: 2,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  jackpotRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jackpotIcon: {
    fontSize: 28,
    marginRight: 8,
  },
  jackpotValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  goldSymbol: {
    color: '#fcd34d',
  },

  /* Section Label */
  sectionRow: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 13,
    color: 'rgba(252, 211, 77, 0.8)',
    letterSpacing: 2,
    fontWeight: 'bold',
  },

  /* Lantern Area */
  lanternArea: {
    width: '95%',
    alignItems: 'center',
    minHeight: 90,
    justifyContent: 'center',
  },
  lanternGrid: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  placeholderBalls: {
    height: 80,
  },

  /* Star Button */
  starButton: {
    position: 'absolute',
    right: 0,
    padding: 4,
  },

  /* Fortune Text */
  fortuneText: {
    color: '#fcd34d',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(252, 211, 77, 0.5)',
    marginBottom: 16,
  },

  /* Generate Button */
  generateButton: {
    marginTop: 10,
    width: '90%',
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.5)',
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
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  brushIcon: {
    marginRight: 10,
  },

  /* Mode Toggle */
  modeToggle: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 10,
  },
  modeTab: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  modeTabActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderColor: '#d4af37',
  },
  modeTabText: {
    fontSize: 14,
    color: 'rgba(252, 211, 77, 0.5)',
    fontWeight: 'bold',
  },
  modeTabTextActive: {
    color: '#fcd34d',
  },

  /* Zodiac Selector */
  zodiacCard: {
    width: '90%',
    backgroundColor: 'rgba(69, 10, 10, 0.9)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    marginBottom: 14,
  },
  zodiacSectionLabel: {
    fontSize: 13,
    color: 'rgba(252, 211, 77, 0.8)',
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 10,
    textAlign: 'center',
  },
  zodiacGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  zodiacItem: {
    width: '14.5%',
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  zodiacItemActive: {
    borderColor: '#d4af37',
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
  zodiacEmoji: {
    fontSize: 24,
  },
  zodiacLabel: {
    fontSize: 10,
    color: 'rgba(252, 211, 77, 0.6)',
    marginTop: 2,
  },
  zodiacLabelActive: {
    color: '#fcd34d',
    fontWeight: 'bold',
  },

  /* Hour Selector */
  hourScroll: {
    paddingHorizontal: 4,
    gap: 8,
  },
  hourPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    alignItems: 'center',
  },
  hourPillActive: {
    borderColor: '#d4af37',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  hourPillText: {
    fontSize: 13,
    color: 'rgba(252, 211, 77, 0.6)',
    fontWeight: 'bold',
  },
  hourPillTextActive: {
    color: '#fcd34d',
  },
  hourPillTime: {
    fontSize: 10,
    color: 'rgba(252, 211, 77, 0.4)',
    marginTop: 2,
  },

  /* Fixed Bottom Nav */
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.15)',
    backgroundColor: 'rgba(69, 10, 10, 0.95)',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 11,
    color: 'rgba(252, 211, 77, 0.7)',
    marginTop: 4,
  },
});
