import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Button,
} from 'react-native';
import {
  VolumeManager,
  useRingerMode,
  RINGER_MODE,
  RingerSilentStatus,
} from 'react-native-volume-manager';
import Slider from '@react-native-community/slider';

const modeText = {
  [RINGER_MODE.silent]: 'Silent',
  [RINGER_MODE.normal]: 'Normal',
  [RINGER_MODE.vibrate]: 'Vibrate',
};

function nullishBooleanToString(value: boolean | undefined) {
  return value === undefined ? 'unset' : value ? 'YES' : 'NO';
}

export default function Screen2() {
  const [currentSystemVolume, setReportedSystemVolume] = useState<number>(0);
  const [isMuted] = useState<boolean | undefined>();
  const [initialQuery] = useState<boolean | undefined>();
  const [ringerStatus] = useState<RingerSilentStatus>();
  const [hideUI, setHideUI] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);

  const log = (msg: string) => {
    setLogs([String(msg), ...logs]);
  };

  const trigger = () => {
    VolumeManager.activateKeyListener()
      .then((res) => {
        log(res);
      })
      .catch((err) => {
        log(err);
      });
  };

  const triggerClose = () => {
    VolumeManager.inactivateKeyListener()
      .then((res) => {
        log(res);
      })
      .catch((err) => {
        log(err);
      });
  };

  useEffect(() => {
    VolumeManager.activateKeyListener();
    VolumeManager.activateKeyListener();
    return () => {
      VolumeManager.inactivateKeyListener();
      VolumeManager.inactivateKeyListener();
    };
  }, []);

  const { mode, error, setMode } = useRingerMode();

  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>iOS / Android</Text>
          <View style={styles.row}>
            <Text style={styles.text}>Current volume:</Text>
            <Text style={styles.text}>{currentSystemVolume}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>Is muted?:</Text>
            <Text style={styles.text}>
              {currentSystemVolume <= 0 ? 'YES' : 'NO'}
            </Text>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.text}>
              Volume update {hideUI ? '(without toast)' : '(with toast)'}
            </Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#000"
            maximumTrackTintColor="#999"
            onValueChange={(value) => {
              VolumeManager.setVolume(value, { showUI: !hideUI });
            }}
            onSlidingComplete={async (value) => {
              setReportedSystemVolume(value);
            }}
            value={currentSystemVolume}
            step={0.001}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => setHideUI((shouldHide) => !shouldHide)}
          >
            <Text style={styles.buttonText}>
              {hideUI ? 'Show native volume Toast' : 'Hide native volume Toast'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={trigger}>
            <Text style={styles.buttonText}>触发222</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={triggerClose}>
            <Text style={styles.buttonText}>关闭</Text>
          </TouchableOpacity>
          {logs.map((log) => (
            <Text key={Math.random()}>{log}</Text>
          ))}
          <View style={{ height: 10 }} />

          <View style={styles.card}>
            <Text style={styles.cardTitle}>iOS only features</Text>
            <View style={styles.row}>
              <Text style={styles.text}>Silent switch active?:</Text>
              <Text style={styles.text}>
                {Platform.OS === 'ios'
                  ? `${nullishBooleanToString(
                      isMuted
                    )} (initial query: ${nullishBooleanToString(initialQuery)})`
                  : 'Unsupported on Android'}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Android only features</Text>
            <View style={styles.row}>
              <Text style={styles.text}>Ringer Mode listener:</Text>
              <Text style={styles.text}>{ringerStatus?.mode}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.text}>Selected Ringer Mode:</Text>
              <Text style={styles.text}>
                {mode !== undefined
                  ? modeText[mode]
                  : Platform.OS === 'ios'
                  ? 'Unsupported on iOS'
                  : 'Unknown'}
              </Text>
            </View>

            <View style={{ marginTop: 20 }}>
              <Text style={styles.text}>Set Ringer mode:</Text>
              <View
                style={{
                  marginTop: 20,
                  height: 120,
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  title="Silent"
                  onPress={() => setMode(RINGER_MODE.silent)}
                />
                <Button
                  title="Normal"
                  onPress={() => setMode(RINGER_MODE.normal)}
                />
                <Button
                  title="Vibrate"
                  onPress={() => setMode(RINGER_MODE.vibrate)}
                />
              </View>
            </View>

            <View>
              <View />
              <View
                style={{
                  marginTop: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={styles.text}>{error?.message}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  card: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 16,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#000',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
  },
});
