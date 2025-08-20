import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  RefreshControl, 
  Dimensions, 
  TouchableOpacity,
  Animated,
  StatusBar
} from "react-native";
import { Switch } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { timetableData } from "../data/timetableData";
import { timetable2Data } from "../data/timetable2Data";
import { getSubjectColor, getSubjectLightColor } from "../utils/subjectColors";
import { isCurrentDay, getCurrentPeriod, formatTimeForDisplay } from "../utils/timeUtils";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentWeekDates, setCurrentWeekDates] = useState([]);
  const [isClass6A, setIsClass6A] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedCards, setExpandedCards] = useState(new Set());

  useEffect(() => {
    loadWeekDates();
    // Auto-expand current day on load
    const currentDay = moment().format("ddd");
    setExpandedCards(new Set([currentDay]));
  }, []);

  useEffect(() => {
    setExpandedCards(new Set());
  }, [isClass6A]);

  const loadWeekDates = () => {
    const startOfWeek = moment().startOf('isoWeek');
    const dates = [];
    for (let i = 0; i < 6; i++) {
      dates.push({
        date: startOfWeek.clone().add(i, 'days').format("DD MMM"),
        dayName: startOfWeek.clone().add(i, 'days').format("ddd")
      });
    }
    setCurrentWeekDates(dates);
  };

  const currentData = isClass6A ? (timetable2Data || []) : (timetableData || []);

  const getCurrentDay = () => moment().format("ddd");

  const toggleDayExpansion = (day) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(day)) {
      newExpanded.delete(day);
    } else {
      newExpanded.add(day);
    }
    setExpandedCards(newExpanded);
  };

  const renderPeriodItem = (period, index, dayData) => {
    const subjectColor = getSubjectColor(period.subject);
    const lightColor = getSubjectLightColor(period.subject);
    const currentPeriodInfo = getCurrentPeriod(dayData.periods);
    
    let isCurrentPeriod = false;
    let isNextPeriod = false;
    
    if (currentPeriodInfo && currentPeriodInfo.index === index) {
      isCurrentPeriod = currentPeriodInfo.status === 'current';
      isNextPeriod = currentPeriodInfo.status === 'next';
    }

    return (
      <View key={index} style={[
        styles.periodItem,
        isCurrentPeriod && styles.currentPeriodItem,
        isNextPeriod && styles.nextPeriodItem,
        { borderLeftColor: subjectColor }
      ]}>
        <View style={styles.periodContent}>
          <View style={styles.timeContainer}>
            <Text style={[
              styles.timeText, 
              { color: isCurrentPeriod || isNextPeriod ? '#fff' : '#64748b' }
            ]}>
              {formatTimeForDisplay(period.time)}
            </Text>
          </View>
          
          <View style={styles.subjectInfo}>
            <Text style={[
              styles.subjectText, 
              { color: isCurrentPeriod || isNextPeriod ? '#fff' : '#1e293b' }
            ]}>
              {period.subject}
            </Text>
            
            {(isCurrentPeriod || isNextPeriod) && (
              <View style={styles.statusBadge}>
                <Icon 
                  name={isCurrentPeriod ? "play" : "clock-outline"} 
                  size={12} 
                  color="#fff" 
                />
                <Text style={styles.statusText}>
                  {isCurrentPeriod ? "Live" : "Next"}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Modern Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.titleSection}>
            <Text style={styles.greeting}>Good {moment().hour() < 12 ? 'Morning' : moment().hour() < 17 ? 'Afternoon' : 'Evening'}</Text>
            <Text style={styles.title}>Your Schedule</Text>
          </View>
          
          <View style={styles.dateSection}>
            <Text style={styles.dateText}>{moment().format("ddd")}</Text>
            <Text style={styles.dayText}>{moment().format("DD")}</Text>
          </View>
        </View>
        
        {/* Class Toggle */}
        <View style={styles.classToggle}>
          <TouchableOpacity 
            style={[styles.classButton, !isClass6A && styles.activeClassButton]}
            onPress={() => setIsClass6A(false)}
          >
            <Text style={[styles.classButtonText, !isClass6A && styles.activeClassButtonText]}>
              Class 6-B
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.classButton, isClass6A && styles.activeClassButton]}
            onPress={() => setIsClass6A(true)}
          >
            <Text style={[styles.classButtonText, isClass6A && styles.activeClassButtonText]}>
              Class 6-A
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => {
                loadWeekDates();
                setRefreshing(false);
              }, 1000);
            }}
            colors={['#6366f1']}
            tintColor="#6366f1"
          />
        }
      >
        <View style={styles.scheduleContainer}>
          {currentData?.map((dayData) => {
            if (!dayData.periods || dayData.periods.length === 0) return null;
            
            const isToday = isCurrentDay(dayData.day);
            const isExpanded = expandedCards.has(dayData.day);
            const currentPeriodInfo = isToday ? getCurrentPeriod(dayData.periods) : null;
            
            return (
              <View key={dayData.day} style={[
                styles.dayCard,
                isToday && styles.todayCard
              ]}>
                <TouchableOpacity 
                  style={styles.dayHeader}
                  onPress={() => toggleDayExpansion(dayData.day)}
                  activeOpacity={0.7}
                >
                  <View style={styles.dayHeaderLeft}>
                    <View style={[styles.dayIcon, isToday && styles.todayIcon]}>
                      <Icon 
                        name={isToday ? "star" : "calendar-blank"} 
                        size={18} 
                        color={isToday ? "#f59e0b" : "#6366f1"} 
                      />
                    </View>
                    
                    <View style={styles.dayInfo}>
                      <Text style={[styles.dayName, isToday && styles.todayName]}>
                        {dayData.day}
                      </Text>
                      <Text style={styles.periodCount}>
                        {dayData.periods.length} periods
                      </Text>
                    </View>
                    
                    {isToday && (
                      <View style={styles.todayBadge}>
                        <Text style={styles.todayBadgeText}>Today</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.dayHeaderRight}>
                    {isToday && currentPeriodInfo && (
                      <View style={styles.liveIndicator}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>
                          {currentPeriodInfo.status === 'current' ? 'Live' : 'Next'}
                        </Text>
                      </View>
                    )}
                    
                    <Icon 
                      name={isExpanded ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#94a3b8" 
                    />
                  </View>
                </TouchableOpacity>
                
                {isExpanded && (
                  <View style={styles.periodsContainer}>
                    {dayData.periods?.map((period, index) => 
                      renderPeriodItem(period, index, dayData)
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  titleSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  dateSection: {
    alignItems: "center",
    backgroundColor: "#6366f1",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    minWidth: 60,
  },
  dateText: {
    fontSize: 12,
    color: "#e0e7ff",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dayText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
    marginTop: 2,
  },
  classToggle: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 4,
  },
  classButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  activeClassButton: {
    backgroundColor: "#6366f1",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  classButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  activeClassButtonText: {
    color: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scheduleContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  dayCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  todayCard: {
    borderWidth: 2,
    borderColor: "#f59e0b",
    shadowColor: "#f59e0b",
    shadowOpacity: 0.15,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  dayHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dayIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  todayIcon: {
    backgroundColor: "#fef3c7",
  },
  dayInfo: {
    flex: 1,
  },
  dayName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 2,
  },
  todayName: {
    color: "#92400e",
  },
  periodCount: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  todayBadge: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 12,
  },
  todayBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dayHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10b981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
    marginRight: 6,
  },
  liveText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  periodsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  periodItem: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    overflow: "hidden",
  },
  currentPeriodItem: {
    backgroundColor: "#6366f1",
    borderLeftColor: "#fff",
  },
  nextPeriodItem: {
    backgroundColor: "#8b5cf6",
    borderLeftColor: "#fff",
  },
  periodContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  timeContainer: {
    minWidth: 70,
    marginRight: 16,
  },
  timeText: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  subjectInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subjectText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

export default HomeScreen;
