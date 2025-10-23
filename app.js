(() => {
  const form = document.getElementById('uploadForm');
  const submitBtn = document.getElementById('submitBtn');
  const progress = document.getElementById('progress');
  const progressSection = document.getElementById('progressSection');
  const progressText = document.getElementById('progressText');
  const errorBox = document.getElementById('error');
  const resultSection = document.getElementById('resultSection');
  const chorusInfo = document.getElementById('chorusInfo');
  const player = document.getElementById('player');
  const downloadLink = document.getElementById('downloadLink');
  const yearEl = document.getElementById('year');
  const dropzone = document.getElementById('dropzone');
  const fileInfo = document.getElementById('fileInfo');
  let lastSelectedDurationSec = null;
  const langSelect = document.getElementById('lang');

  const API_BASE = 'https://v1.chorusclip.com';
  const SUPPORTED_LANGS = ['zh','en','ja','ko','fr','de','es','ru','it','tr','pl','uk','vi','th','id','ms','ar'];
  const PREFERRED_LANG_KEY = 'preferred_lang';
  const USER_SWITCHED_FLAG = 'i18n_user_switched';
  const I18N = {
    en: {
      seo_title: 'ChorusClip – Online Chorus Detection & Song Highlight Finder | Automatically Clip the Best Part of Any Song',
      seo_desc: 'ChorusClip is an intelligent online tool that automatically detects the chorus or most exciting part of a song. Upload your audio to instantly generate 10, 15, or 30-second highlight clips — perfect for TikTok, YouTube Shorts, DJs, and music creators.',
      seo_keywords: 'chorus detection, song highlight finder, music hook extractor, automatic clip maker, chorus extractor, music analysis, audio segmentation, song clip generator, short video music tool, DJ tools, music creators',
      brand: 'ChorusClip',
      hero_title: 'Online Chorus Detection & Song Highlight Finder',
      hero_sub: 'Automatically detect the chorus or most exciting part of any song. Generate highlight clips instantly — perfect for TikTok, YouTube Shorts, and music creators.',
      drop_title: 'Drag & drop your audio here',
      drop_sub: 'or click to select file',
      duration_label: 'Duration',
      dur_5: '5 seconds', dur_15: '15 seconds', dur_30: '30 seconds',
      extract_btn: 'Extract chorus',
      result_title: 'Result',
      download_btn: 'Download chorus',
      settings_title: 'Conversion Settings',
      limits_supported: 'Supported formats:',
      limits_max_size: 'Max file size:',
      limits_max_len: 'Max audio length:',
      limits_min_len: 'Minimum audio length:',
      limits_clip_dur: 'Clip duration:',
      err_choose_file: 'Please choose an audio file.',
      err_size: 'File size exceeds 50MB limit.',
      err_minlen: 'Minimum audio length is 2 minutes.',
      err_maxlen: 'Max audio length is 15 minutes.',
      processing: 'Processing… This can take up to a minute for long audio.',
      chorus_starts: (s)=>`Chorus starts at ${s}s`
    },
    zh: {
      seo_title: '在线副歌检测与自动截取工具 | 一键找到歌曲最高潮部分',
      seo_desc: '智能音乐副歌检测工具，自动识别歌曲中最抓耳的高潮片段。上传音频，一键生成 10/15/30 秒的副歌短片，适用于短视频创作、混音、试听片头等场景。',
      seo_keywords: '副歌检测, 歌曲高光查找器, 音乐hook提取器, 自动片段制作器, 副歌提取器, 音乐分析, 音频分割, 歌曲片段生成器, 短视频音乐工具, DJ工具, 音乐创作者',
      brand: 'ChorusClip',
      hero_title: '在线副歌检测与自动截取工具',
      hero_sub: '一键找到歌曲最高潮部分。智能音乐副歌检测工具，自动识别歌曲中最抓耳的高潮片段。上传音频，一键生成 10/15/30 秒的副歌短片，适用于短视频创作、混音、试听片头等场景。',
      drop_title: '拖拽或粘贴音频到此处',
      drop_sub: '或点击选择文件',
      duration_label: '时长',
      dur_5: '5 秒', dur_15: '15 秒', dur_30: '30 秒',
      extract_btn: '摘录副歌',
      result_title: '结果',
      download_btn: '下载副歌',
      settings_title: '转换设置',
      limits_supported: '支持的格式：',
      limits_max_size: '最大文件大小：',
      limits_max_len: '最大音频时长：',
      limits_min_len: '最小音频时长：',
      limits_clip_dur: '截取时长：',
      err_choose_file: '请选择一个音频文件。',
      err_size: '文件大小超过 50MB 限制。',
      err_minlen: '最小音频时长为 2 分钟。',
      err_maxlen: '最大音频时长为 15 分钟。',
      processing: '处理中… 对于较长音频可能需要一分钟。',
      chorus_starts: (s)=>`副歌开始于 ${s} 秒`
    },
    ja: {
      seo_title: 'ChorusClip – オンライン副歌検出＆楽曲ハイライト検索 | あらゆる楽曲の最高の部分を自動クリップ',
      seo_desc: 'ChorusClipは楽曲の副歌や最もエキサイティングな部分を自動検出するインテリジェントなオンラインツールです。音声をアップロードして10、15、30秒のハイライトクリップを即座に生成——TikTok、YouTube Shorts、DJ、音楽クリエイターに最適。',
      seo_keywords: '副歌検出, 楽曲ハイライト検索, 音楽フック抽出器, 自動クリップメーカー, 副歌抽出器, 音楽分析, オーディオセグメンテーション, 楽曲クリップ生成器, ショート動画音楽ツール, DJツール, 音楽クリエイター',
      brand: 'ChorusClip',
      hero_title: 'オンライン副歌検出＆楽曲ハイライト検索',
      hero_sub: '楽曲の副歌や最もエキサイティングな部分を自動検出。ハイライトクリップを即座に生成——TikTok、YouTube Shorts、音楽クリエイターに最適。',
      drop_title: 'ここに音声をドラッグ＆ドロップ',
      drop_sub: 'またはクリックしてファイルを選択',
      duration_label: '長さ',
      dur_5: '5 秒', dur_15: '15 秒', dur_30: '30 秒',
      extract_btn: '副歌を抽出',
      result_title: '結果',
      download_btn: '副歌をダウンロード',
      settings_title: '変換設定',
      limits_supported: '対応フォーマット：',
      limits_max_size: '最大ファイルサイズ：',
      limits_max_len: '最大音声長：',
      limits_min_len: '最小音声長：',
      limits_clip_dur: 'クリップ長：',
      err_choose_file: '音声ファイルを選択してください。',
      err_size: 'ファイルサイズが 50MB を超えています。',
      err_minlen: '最小音声長は 2 分です。',
      err_maxlen: '最大音声長は 15 分です。',
      processing: '処理中… 長い音声は最大1分かかる場合があります。',
      chorus_starts: (s)=>`副歌開始位置: ${s}秒`
    },
    ko: {
      seo_title: 'ChorusClip – 온라인 후크 감지 및 곡 하이라이트 검색기 | 모든 곡의 최고 부분을 자동으로 클립',
      seo_desc: 'ChorusClip은 곡의 후크나 가장 흥미진진한 부분을 자동으로 감지하는 지능형 온라인 도구입니다. 오디오를 업로드하여 10, 15, 30초 하이라이트 클립을 즉시 생성——TikTok, YouTube Shorts, DJ, 음악 크리에이터에게 완벽합니다.',
      seo_keywords: '후크 감지, 곡 하이라이트 검색기, 음악 훅 추출기, 자동 클립 메이커, 후크 추출기, 음악 분석, 오디오 분할, 곡 클립 생성기, 숏 비디오 음악 도구, DJ 도구, 음악 크리에이터',
      brand: 'ChorusClip',
      hero_title: '온라인 후크 감지 및 곡 하이라이트 검색기',
      hero_sub: '곡의 후크나 가장 흥미진진한 부분을 자동으로 감지합니다. 하이라이트 클립을 즉시 생성——TikTok, YouTube Shorts, 음악 크리에이터에게 완벽합니다.',
      drop_title: '오디오 파일을 여기에 끌어다 놓기',
      drop_sub: '또는 클릭하여 파일 선택',
      duration_label: '길이',
      dur_5: '5초', dur_15: '15초', dur_30: '30초',
      extract_btn: '후크 추출',
      result_title: '결과',
      download_btn: '후크 다운로드',
      settings_title: '변환 설정',
      limits_supported: '지원 포맷:',
      limits_max_size: '최대 파일 크기:',
      limits_max_len: '최대 오디오 길이:',
      limits_min_len: '최소 오디오 길이:',
      limits_clip_dur: '클립 길이:',
      err_choose_file: '오디오 파일을 선택하세요.',
      err_size: '파일 크기가 50MB를 초과했습니다.',
      err_minlen: '최소 오디오 길이는 2분입니다.',
      err_maxlen: '최대 오디오 길이는 15분입니다.',
      processing: '처리 중… 긴 오디오는 최대 1분 걸릴 수 있습니다.',
      chorus_starts: (s)=>`후크 시작: ${s}초`
    },
    fr: {
      seo_title: 'ChorusClip – Détection de refrain et recherche de moments forts en ligne | Couper automatiquement la meilleure partie de toute chanson',
      seo_desc: 'ChorusClip est un outil en ligne intelligent qui détecte automatiquement le refrain ou la partie la plus excitante d\'une chanson. Téléchargez votre audio pour générer instantanément des clips de moments forts de 10, 15 ou 30 secondes — parfait pour TikTok, YouTube Shorts, DJ et créateurs de musique.',
      seo_keywords: 'détection refrain, recherche moments forts, extracteur hook musique, créateur clips automatique, extracteur refrain, analyse musique, segmentation audio, générateur clips chanson, outil musique vidéo courte, outils DJ, créateurs musique',
      brand: 'ChorusClip',
      hero_title: 'Détection de refrain et recherche de moments forts en ligne',
      hero_sub: 'Détectez automatiquement le refrain ou la partie la plus excitante de toute chanson. Générez instantanément des clips de moments forts — parfait pour TikTok, YouTube Shorts et créateurs de musique.',
      drop_title: 'Glissez-déposez votre audio ici',
      drop_sub: 'ou cliquez pour choisir un fichier',
      duration_label: 'Durée',
      dur_5: '5 secondes', dur_15: '15 secondes', dur_30: '30 secondes',
      extract_btn: 'Extraire le refrain',
      result_title: 'Résultat',
      download_btn: 'Télécharger le refrain',
      settings_title: 'Paramètres de conversion',
      limits_supported: 'Formats pris en charge :',
      limits_max_size: 'Taille max. du fichier :',
      limits_max_len: 'Durée audio max. :',
      limits_min_len: 'Durée audio min. :',
      limits_clip_dur: 'Durée du clip :',
      err_choose_file: 'Veuillez choisir un fichier audio.',
      err_size: 'La taille du fichier dépasse 50 Mo.',
      err_minlen: 'La durée audio minimale est de 2 minutes.',
      err_maxlen: 'La durée audio maximale est de 15 minutes.',
      processing: 'Traitement… Les fichiers longs peuvent prendre jusqu’à une minute.',
      chorus_starts: (s)=>`Début du refrain à ${s}s`
    },
    de: {
      seo_title: 'ChorusClip – Online-Refrain-Erkennung und Song-Highlight-Finder | Automatisch den besten Teil jedes Songs ausschneiden',
      seo_desc: 'ChorusClip ist ein intelligentes Online-Tool, das automatisch den Refrain oder den aufregendsten Teil eines Songs erkennt. Laden Sie Ihr Audio hoch, um sofort 10, 15 oder 30-Sekunden-Highlight-Clips zu generieren — perfekt für TikTok, YouTube Shorts, DJs und Musikschöpfer.',
      seo_keywords: 'refrain erkennung, song highlight finder, musik hook extraktor, automatischer clip maker, refrain extraktor, musik analyse, audio segmentierung, song clip generator, kurzes video musik tool, DJ tools, musik schöpfer',
      brand: 'ChorusClip',
      hero_title: 'Online-Refrain-Erkennung und Song-Highlight-Finder',
      hero_sub: 'Erkennen Sie automatisch den Refrain oder den aufregendsten Teil jedes Songs. Generieren Sie sofort Highlight-Clips — perfekt für TikTok, YouTube Shorts und Musikschöpfer.',
      drop_title: 'Audio hierher ziehen und ablegen',
      drop_sub: 'oder klicken, um eine Datei auszuwählen',
      duration_label: 'Dauer',
      dur_5: '5 Sekunden', dur_15: '15 Sekunden', dur_30: '30 Sekunden',
      extract_btn: 'Refrain extrahieren',
      result_title: 'Ergebnis',
      download_btn: 'Refrain herunterladen',
      settings_title: 'Konvertierungseinstellungen',
      limits_supported: 'Unterstützte Formate:',
      limits_max_size: 'Max. Dateigröße:',
      limits_max_len: 'Max. Audiolänge:',
      limits_min_len: 'Min. Audiolänge:',
      limits_clip_dur: 'Clip-Dauer:',
      err_choose_file: 'Bitte wählen Sie eine Audiodatei.',
      err_size: 'Dateigröße überschreitet 50 MB.',
      err_minlen: 'Minimale Audiolänge ist 2 Minuten.',
      err_maxlen: 'Maximale Audiolänge ist 15 Minuten.',
      processing: 'Verarbeitung… Lange Dateien können bis zu 1 Minute dauern.',
      chorus_starts: (s)=>`Refrain beginnt bei ${s}s`
    },
    es: {
      seo_title: 'ChorusClip – Detección de estribillo y buscador de momentos destacados online | Cortar automáticamente la mejor parte de cualquier canción',
      seo_desc: 'ChorusClip es una herramienta online inteligente que detecta automáticamente el estribillo o la parte más emocionante de una canción. Sube tu audio para generar instantáneamente clips destacados de 10, 15 o 30 segundos — perfecto para TikTok, YouTube Shorts, DJs y creadores de música.',
      seo_keywords: 'detección estribillo, buscador momentos destacados, extractor hook música, creador clips automático, extractor estribillo, análisis música, segmentación audio, generador clips canción, herramienta música video corto, herramientas DJ, creadores música',
      brand: 'ChorusClip',
      hero_title: 'Detección de estribillo y buscador de momentos destacados online',
      hero_sub: 'Detecta automáticamente el estribillo o la parte más emocionante de cualquier canción. Genera clips destacados instantáneamente — perfecto para TikTok, YouTube Shorts y creadores de música.',
      drop_title: 'Arrastra y suelta tu audio aquí',
      drop_sub: 'o haz clic para seleccionar un archivo',
      duration_label: 'Duración',
      dur_5: '5 segundos', dur_15: '15 segundos', dur_30: '30 segundos',
      extract_btn: 'Extraer estribillo',
      result_title: 'Resultado',
      download_btn: 'Descargar estribillo',
      settings_title: 'Configuración de conversión',
      limits_supported: 'Formatos compatibles:',
      limits_max_size: 'Tamaño máximo de archivo:',
      limits_max_len: 'Duración máxima de audio:',
      limits_min_len: 'Duración mínima de audio:',
      limits_clip_dur: 'Duración del clip:',
      err_choose_file: 'Elige un archivo de audio.',
      err_size: 'El archivo supera el límite de 50 MB.',
      err_minlen: 'La duración mínima es de 2 minutos.',
      err_maxlen: 'La duración máxima es de 15 minutos.',
      processing: 'Procesando… Los archivos largos pueden tardar hasta un minuto.',
      chorus_starts: (s)=>`El estribillo comienza en ${s}s`
    },
    ru: {
      seo_title: 'ChorusClip – Онлайн-детектор припева и поиск музыкальных моментов | Автоматически вырезать лучшую часть любой песни',
      seo_desc: 'ChorusClip — это интеллектуальный онлайн-инструмент, который автоматически определяет припев или самую захватывающую часть песни. Загрузите аудио для мгновенного создания клипов-хайлайтов длительностью 10, 15 или 30 секунд — идеально для TikTok, YouTube Shorts, диджеев и музыкальных создателей.',
      seo_keywords: 'детектор припева, поиск музыкальных моментов, экстрактор музыкальных хуков, автоматический создатель клипов, экстрактор припева, анализ музыки, сегментация аудио, генератор клипов песен, инструмент музыки для коротких видео, инструменты диджея, музыкальные создатели',
      brand: 'ChorusClip',
      hero_title: 'Онлайн-детектор припева и поиск музыкальных моментов',
      hero_sub: 'Автоматически определяйте припев или самую захватывающую часть любой песни. Мгновенно создавайте клипы-хайлайты — идеально для TikTok, YouTube Shorts и музыкальных создателей.',
      drop_title: 'Перетащите аудио сюда',
      drop_sub: 'или нажмите, чтобы выбрать файл',
      duration_label: 'Длительность',
      dur_5: '5 секунд', dur_15: '15 секунд', dur_30: '30 секунд',
      extract_btn: 'Извлечь припев',
      result_title: 'Результат',
      download_btn: 'Скачать припев',
      settings_title: 'Параметры конвертации',
      limits_supported: 'Поддерживаемые форматы:',
      limits_max_size: 'Макс. размер файла:',
      limits_max_len: 'Макс. длительность аудио:',
      limits_min_len: 'Мин. длительность аудио:',
      limits_clip_dur: 'Длительность клипа:',
      err_choose_file: 'Выберите аудиофайл.',
      err_size: 'Размер файла превышает 50 МБ.',
      err_minlen: 'Минимальная длительность — 2 минуты.',
      err_maxlen: 'Максимальная длительность — 15 минут.',
      processing: 'Обработка… Для длинных файлов может потребоваться до минуты.',
      chorus_starts: (s)=>`Припев начинается на ${s}с`
    },
    it: {
      seo_title: 'ChorusClip – Rilevamento ritornello online e cercatore momenti salienti | Tagliare automaticamente la parte migliore di qualsiasi canzone',
      seo_desc: 'ChorusClip è uno strumento online intelligente che rileva automaticamente il ritornello o la parte più emozionante di una canzone. Carica il tuo audio per generare istantaneamente clip salienti di 10, 15 o 30 secondi — perfetto per TikTok, YouTube Shorts, DJ e creatori musicali.',
      seo_keywords: 'rilevamento ritornello, cercatore momenti salienti, estrattore hook musicale, creatore clip automatico, estrattore ritornello, analisi musicale, segmentazione audio, generatore clip canzoni, strumento musica video brevi, strumenti DJ, creatori musicali',
      brand: 'ChorusClip',
      hero_title: 'Rilevamento ritornello online e cercatore momenti salienti',
      hero_sub: 'Rileva automaticamente il ritornello o la parte più emozionante di qualsiasi canzone. Genera istantaneamente clip salienti — perfetto per TikTok, YouTube Shorts e creatori musicali.',
      drop_title: 'Trascina qui il tuo audio',
      drop_sub: 'oppure clicca per scegliere un file',
      duration_label: 'Durata',
      dur_5: '5 secondi', dur_15: '15 secondi', dur_30: '30 secondi',
      extract_btn: 'Estrai ritornello',
      result_title: 'Risultato',
      download_btn: 'Scarica ritornello',
      settings_title: 'Impostazioni di conversione',
      limits_supported: 'Formati supportati:',
      limits_max_size: 'Dimensione massima file:',
      limits_max_len: 'Durata massima audio:',
      limits_min_len: 'Durata minima audio:',
      limits_clip_dur: 'Durata clip:',
      err_choose_file: 'Seleziona un file audio.',
      err_size: 'La dimensione supera 50 MB.',
      err_minlen: 'La durata minima è 2 minuti.',
      err_maxlen: 'La durata massima è 15 minuti.',
      processing: 'Elaborazione… I file lunghi possono richiedere fino a un minuto.',
      chorus_starts: (s)=>`Il ritornello inizia a ${s}s`
    },
    tr: {
      seo_title: 'ChorusClip – Çevrimiçi nakarat tespiti ve şarkı öne çıkan bulucu | Herhangi bir şarkının en iyi kısmını otomatik kırp',
      seo_desc: 'ChorusClip, bir şarkının nakaratını veya en heyecan verici kısmını otomatik olarak tespit eden akıllı bir çevrimiçi araçtır. Sesinizi yükleyerek 10, 15 veya 30 saniyelik öne çıkan klipleri anında oluşturun — TikTok, YouTube Shorts, DJ\'ler ve müzik yaratıcıları için mükemmel.',
      seo_keywords: 'nakarat tespiti, şarkı öne çıkan bulucu, müzik hook çıkarıcı, otomatik klip yapıcı, nakarat çıkarıcı, müzik analizi, ses segmentasyonu, şarkı klip üretici, kısa video müzik aracı, DJ araçları, müzik yaratıcıları',
      brand: 'ChorusClip',
      hero_title: 'Çevrimiçi nakarat tespiti ve şarkı öne çıkan bulucu',
      hero_sub: 'Herhangi bir şarkının nakaratını veya en heyecan verici kısmını otomatik olarak tespit edin. Öne çıkan klipleri anında oluşturun — TikTok, YouTube Shorts ve müzik yaratıcıları için mükemmel.',
      drop_title: 'Sesi buraya sürükleyip bırakın',
      drop_sub: 'veya dosya seçmek için tıklayın',
      duration_label: 'Süre',
      dur_5: '5 saniye', dur_15: '15 saniye', dur_30: '30 saniye',
      extract_btn: 'Nakaratı çıkar',
      result_title: 'Sonuç',
      download_btn: 'Nakaratı indir',
      settings_title: 'Dönüştürme ayarları',
      limits_supported: 'Desteklenen formatlar:',
      limits_max_size: 'Maks. dosya boyutu:',
      limits_max_len: 'Maks. ses süresi:',
      limits_min_len: 'Min. ses süresi:',
      limits_clip_dur: 'Klip süresi:',
      err_choose_file: 'Lütfen bir ses dosyası seçin.',
      err_size: 'Dosya boyutu 50MB sınırını aşıyor.',
      err_minlen: 'Minimum ses süresi 2 dakikadır.',
      err_maxlen: 'Maksimum ses süresi 15 dakikadır.',
      processing: 'İşleniyor… Uzun dosyalar bir dakikaya kadar sürebilir.',
      chorus_starts: (s)=>`Nakarat başlangıcı: ${s} sn`
    },
    pl: {
      seo_title: 'ChorusClip – Wykrywanie refrenu online i wyszukiwarka momentów muzycznych | Automatycznie wycinaj najlepszą część każdej piosenki',
      seo_desc: 'ChorusClip to inteligentne narzędzie online, które automatycznie wykrywa refren lub najbardziej ekscytującą część piosenki. Prześlij swój audio, aby natychmiast generować klipy z najważniejszymi momentami trwające 10, 15 lub 30 sekund — idealne dla TikTok, YouTube Shorts, DJ\'ów i twórców muzyki.',
      seo_keywords: 'wykrywanie refrenu, wyszukiwarka momentów muzycznych, ekstraktor muzycznych hooków, automatyczny twórca klipów, ekstraktor refrenu, analiza muzyki, segmentacja audio, generator klipów piosenek, narzędzie muzyki do krótkich filmów, narzędzia DJ, twórcy muzyki',
      brand: 'ChorusClip',
      hero_title: 'Wykrywanie refrenu online i wyszukiwarka momentów muzycznych',
      hero_sub: 'Automatycznie wykrywaj refren lub najbardziej ekscytującą część każdej piosenki. Natychmiast generuj klipy z najważniejszymi momentami — idealne dla TikTok, YouTube Shorts i twórców muzyki.',
      drop_title: 'Przeciągnij i upuść audio tutaj',
      drop_sub: 'lub kliknij, aby wybrać plik',
      duration_label: 'Długość',
      dur_5: '5 s', dur_15: '15 s', dur_30: '30 s',
      extract_btn: 'Wyodrębnij refren',
      result_title: 'Wynik',
      download_btn: 'Pobierz refren',
      settings_title: 'Ustawienia konwersji',
      limits_supported: 'Obsługiwane formaty:',
      limits_max_size: 'Maks. rozmiar pliku:',
      limits_max_len: 'Maks. długość audio:',
      limits_min_len: 'Min. długość audio:',
      limits_clip_dur: 'Długość klipu:',
      err_choose_file: 'Wybierz plik audio.',
      err_size: 'Rozmiar pliku przekracza 50 MB.',
      err_minlen: 'Minimalna długość to 2 minuty.',
      err_maxlen: 'Maksymalna długość to 15 minut.',
      processing: 'Przetwarzanie… Długie pliki mogą potrwać do minuty.',
      chorus_starts: (s)=>`Refren zaczyna się o ${s}s`
    },
    uk: {
      seo_title: 'ChorusClip – Онлайн-виявлення приспіву та пошук музичних моментів | Автоматично вирізати найкращу частину будь-якої пісні',
      seo_desc: 'ChorusClip — це інтелектуальний онлайн-інструмент, який автоматично виявляє приспів або найзахопливішу частину пісні. Завантажте своє аудіо для миттєвого створення кліпів-хайлайтів тривалістю 10, 15 або 30 секунд — ідеально для TikTok, YouTube Shorts, діджеїв та музичних творців.',
      seo_keywords: 'виявлення приспіву, пошук музичних моментів, екстрактор музичних хуків, автоматичний творець кліпів, екстрактор приспіву, аналіз музики, сегментація аудіо, генератор кліпів пісень, інструмент музики для коротких відео, інструменти діджея, музичні творці',
      brand: 'ChorusClip',
      hero_title: 'Онлайн-виявлення приспіву та пошук музичних моментів',
      hero_sub: 'Автоматично виявляйте приспів або найзахопливішу частину будь-якої пісні. Миттєво створюйте кліпи-хайлайти — ідеально для TikTok, YouTube Shorts та музичних творців.',
      drop_title: 'Перетягніть аудіо сюди',
      drop_sub: 'або натисніть, щоб вибрати файл',
      duration_label: 'Тривалість',
      dur_5: '5 с', dur_15: '15 с', dur_30: '30 с',
      extract_btn: 'Витягти приспів',
      result_title: 'Результат',
      download_btn: 'Завантажити приспів',
      settings_title: 'Налаштування конвертації',
      limits_supported: 'Підтримувані формати:',
      limits_max_size: 'Макс. розмір файлу:',
      limits_max_len: 'Макс. тривалість аудіо:',
      limits_min_len: 'Мін. тривалість аудіо:',
      limits_clip_dur: 'Тривалість кліпу:',
      err_choose_file: 'Виберіть аудіофайл.',
      err_size: 'Розмір файлу перевищує 50 МБ.',
      err_minlen: 'Мінімальна тривалість — 2 хвилини.',
      err_maxlen: 'Максимальна тривалість — 15 хвилин.',
      processing: 'Обробка… Для довгих файлів може знадобитися до хвилини.',
      chorus_starts: (s)=>`Приспів починається на ${s} с`
    },
    vi: {
      seo_title: 'ChorusClip – Phát hiện điệp khúc và tìm kiếm điểm nhấn bài hát trực tuyến | Tự động cắt phần hay nhất của bất kỳ bài hát nào',
      seo_desc: 'ChorusClip là công cụ trực tuyến thông minh tự động phát hiện điệp khúc hoặc phần thú vị nhất của bài hát. Tải lên âm thanh để tạo ngay lập tức các clip điểm nhấn 10, 15 hoặc 30 giây — hoàn hảo cho TikTok, YouTube Shorts, DJ và người sáng tạo âm nhạc.',
      seo_keywords: 'phát hiện điệp khúc, tìm kiếm điểm nhấn bài hát, trích xuất hook âm nhạc, tạo clip tự động, trích xuất điệp khúc, phân tích âm nhạc, phân đoạn âm thanh, tạo clip bài hát, công cụ âm nhạc video ngắn, công cụ DJ, người sáng tạo âm nhạc',
      brand: 'ChorusClip',
      hero_title: 'Phát hiện điệp khúc và tìm kiếm điểm nhấn bài hát trực tuyến',
      hero_sub: 'Tự động phát hiện điệp khúc hoặc phần thú vị nhất của bất kỳ bài hát nào. Tạo ngay lập tức các clip điểm nhấn — hoàn hảo cho TikTok, YouTube Shorts và người sáng tạo âm nhạc.',
      drop_title: 'Kéo thả âm thanh vào đây',
      drop_sub: 'hoặc bấm để chọn tệp',
      duration_label: 'Độ dài',
      dur_5: '5 giây', dur_15: '15 giây', dur_30: '30 giây',
      extract_btn: 'Trích xuất điệp khúc',
      result_title: 'Kết quả',
      download_btn: 'Tải điệp khúc',
      settings_title: 'Cài đặt chuyển đổi',
      limits_supported: 'Định dạng hỗ trợ:',
      limits_max_size: 'Kích thước tệp tối đa:',
      limits_max_len: 'Độ dài âm thanh tối đa:',
      limits_min_len: 'Độ dài âm thanh tối thiểu:',
      limits_clip_dur: 'Độ dài clip:',
      err_choose_file: 'Vui lòng chọn tệp âm thanh.',
      err_size: 'Kích thước tệp vượt quá 50MB.',
      err_minlen: 'Độ dài tối thiểu là 2 phút.',
      err_maxlen: 'Độ dài tối đa là 15 phút.',
      processing: 'Đang xử lý… Tệp dài có thể mất đến 1 phút.',
      chorus_starts: (s)=>`Điệp khúc bắt đầu tại ${s}s`
    },
    th: {
      seo_title: 'ChorusClip – ตรวจจับท่อนฮุคและค้นหาจุดเด่นของเพลงออนไลน์ | ตัดส่วนที่ดีที่สุดของเพลงใดๆ อัตโนมัติ',
      seo_desc: 'ChorusClip เป็นเครื่องมือออนไลน์อัจฉริยะที่ตรวจจับท่อนฮุคหรือส่วนที่น่าตื่นเต้นที่สุดของเพลงโดยอัตโนมัติ อัปโหลดเสียงของคุณเพื่อสร้างคลิปไฮไลต์ 10, 15 หรือ 30 วินาทีทันที — เหมาะสำหรับ TikTok, YouTube Shorts, DJ และผู้สร้างเพลง',
      seo_keywords: 'ตรวจจับท่อนฮุค, ค้นหาจุดเด่นของเพลง, สกัดฮุคเพลง, สร้างคลิปอัตโนมัติ, สกัดท่อนฮุค, วิเคราะห์เพลง, แบ่งส่วนเสียง, สร้างคลิปเพลง, เครื่องมือเพลงวิดีโอสั้น, เครื่องมือ DJ, ผู้สร้างเพลง',
      brand: 'ChorusClip',
      hero_title: 'ตรวจจับท่อนฮุคและค้นหาจุดเด่นของเพลงออนไลน์',
      hero_sub: 'ตรวจจับท่อนฮุคหรือส่วนที่น่าตื่นเต้นที่สุดของเพลงใดๆ โดยอัตโนมัติ สร้างคลิปไฮไลต์ทันที — เหมาะสำหรับ TikTok, YouTube Shorts และผู้สร้างเพลง',
      drop_title: 'ลากและวางไฟล์เสียงที่นี่',
      drop_sub: 'หรือคลิกเพื่อเลือกไฟล์',
      duration_label: 'ความยาว',
      dur_5: '5 วินาที', dur_15: '15 วินาที', dur_30: '30 วินาที',
      extract_btn: 'ดึงท่อนฮุค',
      result_title: 'ผลลัพธ์',
      download_btn: 'ดาวน์โหลดท่อนฮุค',
      settings_title: 'การตั้งค่าการแปลง',
      limits_supported: 'รูปแบบที่รองรับ:',
      limits_max_size: 'ขนาดไฟล์สูงสุด:',
      limits_max_len: 'ความยาวเสียงสูงสุด:',
      limits_min_len: 'ความยาวเสียงขั้นต่ำ:',
      limits_clip_dur: 'ความยาวคลิป:',
      err_choose_file: 'โปรดเลือกไฟล์เสียง',
      err_size: 'ขนาดไฟล์เกิน 50MB',
      err_minlen: 'ความยาวขั้นต่ำคือ 2 นาที',
      err_maxlen: 'ความยาวสูงสุดคือ 15 นาที',
      processing: 'กำลังประมวลผล… ไฟล์ยาวอาจใช้เวลาถึง 1 นาที',
      chorus_starts: (s)=>`ท่อนฮุคเริ่มที่ ${s} วินาที`
    },
    id: {
      seo_title: 'ChorusClip – Deteksi chorus dan pencari sorotan lagu online | Potong otomatis bagian terbaik dari lagu apa pun',
      seo_desc: 'ChorusClip adalah alat online cerdas yang secara otomatis mendeteksi chorus atau bagian paling menarik dari sebuah lagu. Unggah audio Anda untuk menghasilkan klip sorotan 10, 15, atau 30 detik secara instan — sempurna untuk TikTok, YouTube Shorts, DJ, dan kreator musik.',
      seo_keywords: 'deteksi chorus, pencari sorotan lagu, ekstraktor hook musik, pembuat klip otomatis, ekstraktor chorus, analisis musik, segmentasi audio, generator klip lagu, alat musik video pendek, alat DJ, kreator musik',
      brand: 'ChorusClip',
      hero_title: 'Deteksi chorus dan pencari sorotan lagu online',
      hero_sub: 'Deteksi secara otomatis chorus atau bagian paling menarik dari lagu apa pun. Hasilkan klip sorotan secara instan — sempurna untuk TikTok, YouTube Shorts, dan kreator musik.',
      drop_title: 'Tarik & letakkan audio ke sini',
      drop_sub: 'atau klik untuk memilih file',
      duration_label: 'Durasi',
      dur_5: '5 detik', dur_15: '15 detik', dur_30: '30 detik',
      extract_btn: 'Ekstrak chorus',
      result_title: 'Hasil',
      download_btn: 'Unduh chorus',
      settings_title: 'Pengaturan konversi',
      limits_supported: 'Format yang didukung:',
      limits_max_size: 'Ukuran file maks.:',
      limits_max_len: 'Durasi audio maks.:',
      limits_min_len: 'Durasi audio min.:',
      limits_clip_dur: 'Durasi klip:',
      err_choose_file: 'Pilih file audio.',
      err_size: 'Ukuran file melebihi 50MB.',
      err_minlen: 'Durasi minimum 2 menit.',
      err_maxlen: 'Durasi maksimum 15 menit.',
      processing: 'Memproses… File panjang bisa memakan waktu hingga 1 menit.',
      chorus_starts: (s)=>`Chorus mulai pada ${s} dtk`
    },
    ms: {
      seo_title: 'ChorusClip – Pengesan korus dan pencari sorotan lagu dalam talian | Potong secara automatik bahagian terbaik mana-mana lagu',
      seo_desc: 'ChorusClip ialah alat dalam talian pintar yang secara automatik mengesan korus atau bahagian paling menarik dalam lagu. Muat naik audio anda untuk menghasilkan klip sorotan 10, 15, atau 30 saat serta-merta — sempurna untuk TikTok, YouTube Shorts, DJ, dan pencipta muzik.',
      seo_keywords: 'pengesan korus, pencari sorotan lagu, pengekstrak hook muzik, pembuat klip automatik, pengekstrak korus, analisis muzik, segmentasi audio, penjana klip lagu, alat muzik video pendek, alat DJ, pencipta muzik',
      brand: 'ChorusClip',
      hero_title: 'Pengesan korus dan pencari sorotan lagu dalam talian',
      hero_sub: 'Kesan secara automatik korus atau bahagian paling menarik dalam mana-mana lagu. Hasilkan klip sorotan serta-merta — sempurna untuk TikTok, YouTube Shorts, dan pencipta muzik.',
      drop_title: 'Seret & lepaskan audio di sini',
      drop_sub: 'atau klik untuk pilih fail',
      duration_label: 'Tempoh',
      dur_5: '5 saat', dur_15: '15 saat', dur_30: '30 saat',
      extract_btn: 'Ekstrak korus',
      result_title: 'Keputusan',
      download_btn: 'Muat turun korus',
      settings_title: 'Tetapan penukaran',
      limits_supported: 'Format disokong:',
      limits_max_size: 'Saiz fail maks:',
      limits_max_len: 'Tempoh audio maks:',
      limits_min_len: 'Tempoh audio min:',
      limits_clip_dur: 'Tempoh klip:',
      err_choose_file: 'Sila pilih fail audio.',
      err_size: 'Saiz fail melebihi 50MB.',
      err_minlen: 'Tempoh minimum ialah 2 minit.',
      err_maxlen: 'Tempoh maksimum ialah 15 minit.',
      processing: 'Memproses… Fail panjang mungkin mengambil masa sehingga 1 minit.',
      chorus_starts: (s)=>`Korus bermula pada ${s}s`
    },
    ar: {
      seo_title: 'ChorusClip – اكتشاف الكورس وباحث اللحظات الموسيقية المميزة عبر الإنترنت | قص تلقائياً أفضل جزء من أي أغنية',
      seo_desc: 'ChorusClip هو أداة ذكية عبر الإنترنت تكتشف تلقائياً الكورس أو الجزء الأكثر إثارة في الأغنية. ارفع الصوت الخاص بك لتوليد مقاطع مميزة مدتها 10 أو 15 أو 30 ثانية فوراً — مثالية لـ TikTok وYouTube Shorts وDJ ومبدعي الموسيقى.',
      seo_keywords: 'اكتشاف الكورس, باحث اللحظات الموسيقية المميزة, مستخرج الخطاف الموسيقي, صانع المقاطع التلقائي, مستخرج الكورس, تحليل الموسيقى, تجزئة الصوت, مولد مقاطع الأغاني, أداة الموسيقى للفيديوهات القصيرة, أدوات DJ, مبدعو الموسيقى',
      brand: 'ChorusClip',
      hero_title: 'اكتشاف الكورس وباحث اللحظات الموسيقية المميزة عبر الإنترنت',
      hero_sub: 'اكتشف تلقائياً الكورس أو الجزء الأكثر إثارة في أي أغنية. ولد مقاطع مميزة فوراً — مثالية لـ TikTok وYouTube Shorts ومبدعي الموسيقى.',
      drop_title: 'اسحب وأفلت ملف الصوت هنا',
      drop_sub: 'أو انقر لاختيار ملف',
      duration_label: 'المدة',
      dur_5: '5 ثوانٍ', dur_15: '15 ثانية', dur_30: '30 ثانية',
      extract_btn: 'استخراج الكورس',
      result_title: 'النتيجة',
      download_btn: 'تنزيل الكورس',
      settings_title: 'إعدادات التحويل',
      limits_supported: 'الصيغ المدعومة:',
      limits_max_size: 'الحد الأقصى لحجم الملف:',
      limits_max_len: 'الحد الأقصى لمدة الصوت:',
      limits_min_len: 'الحد الأدنى لمدة الصوت:',
      limits_clip_dur: 'مدة المقطع:',
      err_choose_file: 'يرجى اختيار ملف صوتي.',
      err_size: 'يتجاوز حجم الملف 50 ميجابايت.',
      err_minlen: 'الحد الأدنى لمدة الصوت دقيقتان.',
      err_maxlen: 'الحد الأقصى لمدة الصوت 15 دقيقة.',
      processing: 'جارٍ المعالجة… قد تستغرق الملفات الطويلة حتى دقيقة.',
      chorus_starts: (s)=>`بداية الكورس عند ${s}ث`
    }
  };

  function resolveLangFromPath(){
    const isFile = location.protocol === 'file:';
    if (isFile) {
      const url = new URL(location.href);
      const qp = url.searchParams.get('lang');
      if (qp && SUPPORTED_LANGS.includes(qp)) return qp;
      return null;
    }
    const seg = location.pathname.split('/').filter(Boolean)[0];
    if (SUPPORTED_LANGS.includes(seg)) return seg;
    return null;
  }

  function applySeo(dict){
    if (!dict) return;
    if (dict.seo_title) document.title = dict.seo_title;
    const md = document.getElementById('meta-desc') || document.querySelector('meta[name="description"]');
    if (md && dict.seo_desc) md.setAttribute('content', dict.seo_desc);
    const mk = document.getElementById('meta-keys') || document.querySelector('meta[name="keywords"]');
    if (mk && dict.seo_keywords) mk.setAttribute('content', dict.seo_keywords);
  }

  function setLang(lang){
    const dict = I18N[lang] || I18N.en;
    document.documentElement.setAttribute('lang', lang);
    applySeo(dict);
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      let val = dict[key];
      if (val == null) val = I18N.en[key];
      if (typeof val === 'string') el.textContent = val;
    });
    if (langSelect) langSelect.value = lang;
    // Update the global lang variable for error messages
    window.currentLang = lang;
  }

  // Re-apply SEO after window load to avoid any late overrides by the browser
  window.addEventListener('load', () => {
    const currentLang = document.documentElement.getAttribute('lang') || 'en';
    applySeo(I18N[currentLang] || I18N.en);
    // Force SEO update after a short delay to ensure it takes effect
    setTimeout(() => {
      applySeo(I18N[currentLang] || I18N.en);
    }, 100);
  });

  // Also apply SEO immediately when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const currentLang = document.documentElement.getAttribute('lang') || 'en';
    applySeo(I18N[currentLang] || I18N.en);
    // Force SEO update after a short delay
    setTimeout(() => {
      applySeo(I18N[currentLang] || I18N.en);
    }, 50);
  });

  // Use MutationObserver to ensure SEO is applied when title or meta tags change
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'lang' || 
             mutation.target.tagName === 'TITLE' ||
             (mutation.target.tagName === 'META' && 
              (mutation.target.getAttribute('name') === 'description' || 
               mutation.target.getAttribute('name') === 'keywords')))) {
          const currentLang = document.documentElement.getAttribute('lang') || 'en';
          setTimeout(() => {
            applySeo(I18N[currentLang] || I18N.en);
          }, 10);
        }
      });
    });
    
    // Start observing when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.documentElement, { 
        attributes: true, 
        attributeFilter: ['lang'] 
      });
      observer.observe(document.head, { 
        childList: true, 
        subtree: true, 
        attributes: true, 
        attributeFilter: ['content'] 
      });
    });
  }

  function setLangInUrl(value){
    const isFile = location.protocol === 'file:';
    if (isFile) {
      const url = new URL(location.href);
      if (value === 'en') {
        url.searchParams.delete('lang');
      } else {
        url.searchParams.set('lang', value);
      }
      location.href = url.toString();
    } else {
      const parts = location.pathname.split('/');
      const segs = parts.filter(Boolean);
      if (segs.length && SUPPORTED_LANGS.includes(segs[0])) segs.shift();
      const basePath = '/' + segs.join('/');
      const newPath = value === 'en' ? basePath : `/${value}${basePath}`;
      location.replace(`${newPath}${location.search}${location.hash}`);
    }
  }

  function getNavigatorLang(){
    const nav = (navigator.language || 'en').toLowerCase();
    const cand = nav.split('-')[0];
    return SUPPORTED_LANGS.includes(cand) ? cand : 'en';
  }
  function getPreferredLang(){
    const stored = localStorage.getItem(PREFERRED_LANG_KEY);
    return stored && SUPPORTED_LANGS.includes(stored) ? stored : null;
  }

  if (yearEl) yearEl.textContent = new Date().getFullYear();
  // i18n init
  const pathLang = resolveLangFromPath();
  const preferredLang = getPreferredLang();
  const navigatorLang = getNavigatorLang();
  const initialLang = pathLang || preferredLang || navigatorLang;
  // Initialize global lang variable
  window.currentLang = initialLang;
  if (!pathLang && location.protocol !== 'file:') {
    const target = preferredLang || navigatorLang;
    if (target !== 'en') {
      location.replace(`/${target}${location.search}${location.hash}`);
    } else {
      setLang(initialLang);
    }
  } else {
    setLang(initialLang);
  }
  if (langSelect) {
    langSelect.addEventListener('change', (e)=>{
      const value = e.target.value;
      // Remember preference and update texts immediately; navigation happens on next refresh
      localStorage.setItem(PREFERRED_LANG_KEY, value);
      sessionStorage.setItem(USER_SWITCHED_FLAG, '1');
      setLang(value);
      // Apply SEO immediately before navigation
      applySeo(I18N[value] || I18N.en);
      // Navigate to path that reflects the chosen language (for HTTP/HTTPS)
      if (location.protocol !== 'file:') {
        setLangInUrl(value);
      }
    });
  }
  submitBtn.disabled = true;

  function show(el){ el.hidden = false; }
  function hide(el){ el.hidden = true; }
  function setBusy(busy){
    submitBtn.disabled = busy;
    if (busy) {
      show(progressSection);
      show(progress);
    } else {
      hide(progress);
      hide(progressSection);
    }
  }
  function clearResult(){ resultSection.hidden = true; player.src = ''; downloadLink.href = '#'; chorusInfo.textContent = ''; }
  function showError(message){ errorBox.textContent = message; show(errorBox); }
  function clearError(){ errorBox.textContent = ''; hide(errorBox); }
  function friendlyErrorFromDetail(detail){
    if (!detail || typeof detail !== 'object') return 'Processing failed. Please try another file.';
    const type = detail.type || '';
    switch (type) {
      case 'Audio.TooShort': {
        const minSec = detail.min_seconds ?? 120;
        const actual = detail.actual != null ? Math.round(detail.actual) : undefined;
        return actual != null ? `Audio is too short. Minimum ${minSec}s, yours ${actual}s.` : `Audio is too short. Minimum ${minSec}s.`;
      }
      case 'Audio.TooLong': {
        const maxSec = detail.max_seconds ?? 900;
        const mins = Math.round((maxSec)/60);
        return `Audio is too long. Max ${mins} minutes.`;
      }
      case 'Audio.SilentOrLowRMS':
        return 'Audio volume is too low. Please use a louder recording.';
      case 'Audio.MonoRequired':
        return 'Incompatible channel layout. Please upload mono or standard stereo audio.';
      case 'Audio.SampleRateUnsupported': {
        const suggested = detail.hints && detail.hints.suggested ? detail.hints.suggested : 44100;
        return `Unsupported sample rate. Please export at ${suggested} Hz.`;
      }
      case 'Extraction.Failed':
        return 'Chorus not found in this audio. Try another section or a different track.';
      default:
        return detail.message || 'Processing failed. Please try another file.';
    }
  }
  function updateSubmitEnabled(){
    const input = document.getElementById('file');
    submitBtn.disabled = !input.files || input.files.length === 0;
  }
  function setFileInfo(file){
    if (!file) { fileInfo.hidden = true; fileInfo.textContent = ''; return; }
    const sizeMB = (file.size/1024/1024).toFixed(2);
    fileInfo.textContent = `${file.name} — ${sizeMB} MB`;
    fileInfo.hidden = false;
    // Try to estimate duration on client for common formats using Audio element
    try {
      const objectUrl = URL.createObjectURL(file);
      const audio = new Audio();
      const cleanup = () => { URL.revokeObjectURL(objectUrl); };
      audio.preload = 'metadata';
      audio.src = objectUrl;
      audio.onloadedmetadata = () => {
        if (isFinite(audio.duration) && audio.duration > 0) {
          const secs = Math.round(audio.duration);
          fileInfo.textContent += ` • ~${secs}s`;
          lastSelectedDurationSec = secs;
        }
        cleanup();
      };
      audio.onerror = cleanup;
    } catch(_) { /* ignore */ }
  }

  function getAudioDuration(file){
    return new Promise((resolve) => {
      try {
        const url = URL.createObjectURL(file);
        const a = new Audio();
        const done = (val) => { URL.revokeObjectURL(url); resolve(val); };
        a.preload = 'metadata';
        a.src = url;
        a.onloadedmetadata = () => done(isFinite(a.duration) ? a.duration : null);
        a.onerror = () => done(null);
      } catch(_) { resolve(null); }
    });
  }
  // Drag & drop handling
  ;['dragenter','dragover'].forEach(evt => dropzone.addEventListener(evt, (e)=>{ e.preventDefault(); e.stopPropagation(); dropzone.classList.add('dragover'); }));
  ;['dragleave','drop'].forEach(evt => dropzone.addEventListener(evt, (e)=>{ e.preventDefault(); e.stopPropagation(); dropzone.classList.remove('dragover'); }));
  dropzone.addEventListener('click', ()=> document.getElementById('file').click());
  dropzone.addEventListener('keydown', (e)=>{ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.getElementById('file').click(); } });
  dropzone.addEventListener('drop', (e)=>{
    const dt = e.dataTransfer;
    if (!dt || !dt.files || dt.files.length === 0) return;
    const file = dt.files[0];
    const input = document.getElementById('file');
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    input.files = dataTransfer.files;
    setFileInfo(file);
    updateSubmitEnabled();
  });

  document.getElementById('file').addEventListener('change', (e)=>{
    const file = e.target.files && e.target.files[0];
    setFileInfo(file);
    updateSubmitEnabled();
  });

  async function fetchSupportedFormats(){
    try {
      const res = await fetch(`${API_BASE}/supported-formats`);
      if (!res.ok) return;
      const data = await res.json();
      const limits = document.getElementById('limits');
      if (limits && data) {
        const toLowerNoDot = (s) => String(s).replace(/^\./, '').toLowerCase();
        const normalizeFormatList = (arr) => {
          const set = new Set((arr || []).map(toLowerNoDot));
          set.delete('m4a');
          set.add('aac');
          set.add('ogg');
          return Array.from(set).join(', ');
        };
        const normalizeFormats = () => {
          if (Array.isArray(data.supported_formats) && data.supported_formats.length) {
            return normalizeFormatList(data.supported_formats);
          }
          return 'mp3, wav, flac, aac, ogg';
        };
        const normalizeDuration = (val) => {
          if (val == null) return '15 minutes';
          if (typeof val === 'number') {
            const secs = Math.max(0, Math.round(val));
            if (secs >= 60) return `${Math.round(secs/60)} minutes`;
            return `${secs} seconds`;
          }
          const m = String(val).match(/(\d+(?:\.\d+)?)/);
          if (m) {
            const secsNum = Math.round(parseFloat(m[1]));
            if (secsNum >= 60) return `${Math.round(secsNum/60)} minutes`;
            return `${secsNum} seconds`;
          }
          return String(val).replace(/\s*\(.*\)\s*$/, '');
        };

        const formatsEl = document.getElementById('limit-formats');
        const maxSizeEl = document.getElementById('limit-max-size');
        const maxLengthEl = document.getElementById('limit-max-length');
        const minLengthEl = document.getElementById('limit-min-length');
        const clipDurationEl = document.getElementById('limit-clip-duration');

        const formatsText = normalizeFormats();
        const maxSizeText = data.max_file_size || '50MB';
        const maxLengthText = '15 minutes';

        if (formatsEl) formatsEl.textContent = formatsText;
        if (maxSizeEl) maxSizeEl.textContent = maxSizeText;
        if (maxLengthEl) maxLengthEl.textContent = maxLengthText;
        if (minLengthEl) minLengthEl.textContent = '2 minutes';
        if (clipDurationEl) clipDurationEl.textContent = '30s';
      }
    } catch(_) { /* ignore */ }
  }

  fetchSupportedFormats();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();
    clearResult();

    const fileInput = document.getElementById('file');
    const durationInput = document.getElementById('duration');
    // simplified: only duration is configurable

    if (!fileInput.files || fileInput.files.length === 0) {
      showError(I18N[window.currentLang]?.err_choose_file || I18N.en.err_choose_file);
      return;
    }

    const file = fileInput.files[0];
    if (file.size > 50 * 1024 * 1024) {
      showError(I18N[window.currentLang]?.err_size || I18N.en.err_size);
      return;
    }

    // Validate full audio duration: min 2 minutes (120s), max 15 minutes (900s)
    let fullDurationSec = lastSelectedDurationSec;
    if (!fullDurationSec) {
      fullDurationSec = await getAudioDuration(file);
    }
    if (typeof fullDurationSec === 'number') {
      if (fullDurationSec < 120) {
        showError(I18N[window.currentLang]?.err_minlen || I18N.en.err_minlen);
        return;
      }
      if (fullDurationSec > 900) {
        showError(I18N[window.currentLang]?.err_maxlen || I18N.en.err_maxlen);
        return;
      }
    }

    const duration = Number(durationInput.value || 30);
    if (duration < 10 || duration > 120) {
      showError('Clip duration must be between 10 and 120 seconds.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('duration', String(duration));
    // Only send duration; rely on API defaults for other options

    setBusy(true);
    progressText.textContent = I18N[window.currentLang]?.processing || I18N.en.processing;
    
    // Track extraction start event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'extract_chorus_start', {
        'event_category': 'engagement',
        'event_label': `duration_${duration}s`,
        'value': 1
      });
    }

    try {
      const res = await fetch(`${API_BASE}/extract-chorus`, { method: 'POST', body: formData });

      if (!res.ok) {
        let detail;
        try { detail = (await res.json()).detail; } catch(_) {}
        if (detail && typeof detail === 'object') {
          showError(friendlyErrorFromDetail(detail));
        } else {
          showError('Request failed. Please try again later.');
        }
        return;
      }

      const data = await res.json();
      if (!data.success) {
        const msg = data.detail && typeof data.detail === 'object' ? friendlyErrorFromDetail(data.detail) : (data.detail || 'Extraction failed.');
        showError(msg);
        return;
      }

      const fileId = data.file_id;
      const downloadUrl = `${API_BASE}/download/${fileId}`;
      downloadLink.href = downloadUrl;
      chorusInfo.textContent = (I18N[window.currentLang]?.chorus_starts || I18N.en.chorus_starts)(Number(data.chorus_start_sec).toFixed(2));
      
      // Track successful extraction
      if (typeof gtag !== 'undefined') {
        gtag('event', 'extract_chorus_success', {
          'event_category': 'engagement',
          'event_label': `duration_${duration}s`,
          'value': 1
        });
      }

      // Preload audio for online preview
      try {
        const audioRes = await fetch(downloadUrl);
        if (!audioRes.ok) throw new Error('download failed');
        const blob = await audioRes.blob();
        const objectUrl = URL.createObjectURL(blob);
        player.src = objectUrl;
        resultSection.hidden = false;
        
        // Add event tracking for download button
        downloadLink.addEventListener('click', () => {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'download_chorus', {
              'event_category': 'engagement',
              'event_label': `duration_${duration}s`,
              'value': 1
            });
          }
        });
        
        // Add event tracking for audio player
        player.addEventListener('play', () => {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'play_chorus', {
              'event_category': 'engagement',
              'event_label': `duration_${duration}s`,
              'value': 1
            });
          }
        });
        
      } catch (err) {
        // If stream preview fails, still reveal download link
        resultSection.hidden = false;
      }
    } catch (err) {
      showError(err && err.message ? err.message : 'Network error.');
    } finally {
      setBusy(false);
    }
  });
})();


