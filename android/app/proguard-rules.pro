############################################
## REACT-NATIVE CORE
############################################

-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

-keep class com.swmansion.reanimated.** { *; }
-dontwarn com.swmansion.reanimated.**

-keep class com.swmansion.gesturehandler.** { *; }
-dontwarn com.swmansion.gesturehandler.**

-dontwarn com.facebook.react.turbomodule.**
-dontwarn com.facebook.react.bridge.**

############################################
## AXIOS / OKHTTP / RETROFIT / GSON
############################################

# Evita renomear atributos usados na serialização JSON (CRÍTICO!)
-keep class com.google.gson.** { *; }
-keepattributes *Annotation*
-keepattributes Signature

# Preserva nomes dos campos/atributos usados ao enviar payloads
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# Garante que classes POJO usadas em auth e sync mantenham nomes
-keepclassmembers class * {
    public <init>(...);
}

# Evita problemas com OkHttp
-dontwarn okhttp3.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

############################################
## SQLITE (react-native-sqlite-storage)
############################################

-dontwarn io.reactivex.**
-keep class io.sqlcipher.** { *; }
-keep class net.sqlcipher.** { *; }

############################################
## ZUSTAND + PERSIST + MMKV + STORAGE
############################################

# Zustand usa funções que não podem ser renomeadas
-keepclassmembers class * extends java.util.HashMap { *; }

# Evita remover métodos usados viralmente pelo store
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Se estiver usando MMKV (provável)
-keep class com.tencent.mmkv.** { *; }

############################################
## SEU CÓDIGO — API, AUTH, STORE, TYPES
############################################

# Garante que TUDO de src/api não seja renomeado
-keep class src.api.** { *; }
-keep class src.services.** { *; }
-keep class src.database.** { *; }
-keep class src.utils.** { *; }

# Models (UserInfo, Role, SyncInfo, Validation…)
-keep class * implements java.io.Serializable { *; }
-keep class * extends java.lang.Object {
    <fields>;
    <methods>;
}

# Evita remoção de nomes usados internamente para JSON
-keepclassmembers class * {
    public <fields>;
}

############################################
## FIX Para chamadas que usam reflexão / dynamic keys
############################################

-keepclassmembers class * {
    public java.lang.Object get*(...);
    public void set*(...);
}

############################################
## OUTRAS LIBS QUE VI NO PROJETO
############################################

# Navigation
-keep class androidx.navigation.** { *; }

# NetInfo
-keep class com.reactnativecommunity.netinfo.** { *; }

# Permissions / Device info
-keep class com.learnium.RNDeviceInfo.** { *; }

############################################
## AJUSTES IMPORTANTES DE OTIMIZAÇÃO
############################################

# Não otimizar nada dessas classes — estabilidade do RN
-keep class com.facebook.react.bridge.** { *; }

-dontwarn javax.annotation.**
-dontwarn org.intellij.lang.annotations.**
-dontwarn kotlin.**
