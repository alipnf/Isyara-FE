import curriculumData from './curriculum.json';

// Types
export interface LessonPayload {
  hurufRange?: string[];
  numberRange?: string[];
  wordGroup?: string[];
}

export interface LessonDefinition {
  key: string;
  title: string;
  unit: number;
  type: 'lesson' | 'quiz';
  order: number;
  xp: number;
  payload: LessonPayload;
}

export interface UnitMeta {
  id: number;
  title: string;
  description: string;
  color: string;
}

export interface CurriculumMetadata {
  version: string;
  generatedAt: string;
  modelClasses: string[];
  modelAccuracy: number | null;
}

// Parse curriculum data and flatten to array
export const LESSONS: LessonDefinition[] = curriculumData.units.flatMap(
  (unit) =>
    unit.lessons.map((lesson) => ({
      key: lesson.key,
      title: lesson.title,
      unit: unit.id,
      type: lesson.type as 'lesson' | 'quiz',
      order: lesson.order,
      xp: lesson.xp,
      payload: lesson.payload,
    }))
);

// Create indexed map for O(1) lookups by key
export const LESSONS_BY_KEY = new Map<string, LessonDefinition>(
  LESSONS.map((lesson) => [lesson.key, lesson])
);

// Create indexed map for O(1) lookups by unit
const LESSONS_BY_UNIT_MAP = new Map<number, LessonDefinition[]>();
for (const lesson of LESSONS) {
  const unitLessons = LESSONS_BY_UNIT_MAP.get(lesson.unit) || [];
  unitLessons.push(lesson);
  LESSONS_BY_UNIT_MAP.set(lesson.unit, unitLessons);
}

// Sort lessons within each unit by order
for (const [unit, lessons] of LESSONS_BY_UNIT_MAP.entries()) {
  lessons.sort((a, b) => a.order - b.order);
  LESSONS_BY_UNIT_MAP.set(unit, lessons);
}

// Extract unit metadata
export const UNITS: UnitMeta[] = curriculumData.units.map((unit) => ({
  id: unit.id,
  title: unit.title,
  description: unit.description,
  color: unit.color,
}));

// Curriculum metadata
export const CURRICULUM_METADATA: CurriculumMetadata = {
  version: curriculumData.version,
  generatedAt: curriculumData.generated_at,
  modelClasses: curriculumData.model_classes,
  modelAccuracy: curriculumData.model_accuracy,
};

// Helper functions

/**
 * Get a lesson by its unique key
 * @example getLessonByKey('huruf_a_e')
 */
export function getLessonByKey(key: string): LessonDefinition | undefined {
  return LESSONS_BY_KEY.get(key);
}

/**
 * Get all lessons for a specific unit, sorted by order
 * @example getLessonsByUnit(1)
 */
export function getLessonsByUnit(unit: number): LessonDefinition[] {
  return LESSONS_BY_UNIT_MAP.get(unit) || [];
}

/**
 * Get unit metadata by ID
 * @example getUnitMeta(1)
 */
export function getUnitMeta(unitId: number): UnitMeta | undefined {
  return UNITS.find((u) => u.id === unitId);
}

/**
 * Get all available classes from the ML model
 * @example getAvailableClasses() // ['A', 'B', 'C', ...]
 */
export function getAvailableClasses(): string[] {
  return CURRICULUM_METADATA.modelClasses;
}

/**
 * Get all lesson keys
 * @example getAllLessonKeys() // ['huruf_a_e', 'huruf_f_j', ...]
 */
export function getAllLessonKeys(): string[] {
  return LESSONS.map((l) => l.key);
}

/**
 * Get total number of lessons (excluding quizzes)
 */
export function getTotalLessons(): number {
  return LESSONS.filter((l) => l.type === 'lesson').length;
}

/**
 * Get total number of quizzes
 */
export function getTotalQuizzes(): number {
  return LESSONS.filter((l) => l.type === 'quiz').length;
}

/**
 * Get total XP available in curriculum
 */
export function getTotalXP(): number {
  return LESSONS.reduce((sum, lesson) => sum + lesson.xp, 0);
}

/**
 * Validate if a lesson key exists
 */
export function isValidLessonKey(key: string): boolean {
  return LESSONS_BY_KEY.has(key);
}

/**
 * Get next lesson after the given key (within same unit)
 */
export function getNextLesson(
  currentKey: string
): LessonDefinition | undefined {
  const current = getLessonByKey(currentKey);
  if (!current) return undefined;

  const unitLessons = getLessonsByUnit(current.unit);
  const currentIndex = unitLessons.findIndex((l) => l.key === currentKey);

  if (currentIndex >= 0 && currentIndex < unitLessons.length - 1) {
    return unitLessons[currentIndex + 1];
  }

  return undefined;
}

/**
 * Get previous lesson before the given key (within same unit)
 */
export function getPreviousLesson(
  currentKey: string
): LessonDefinition | undefined {
  const current = getLessonByKey(currentKey);
  if (!current) return undefined;

  const unitLessons = getLessonsByUnit(current.unit);
  const currentIndex = unitLessons.findIndex((l) => l.key === currentKey);

  if (currentIndex > 0) {
    return unitLessons[currentIndex - 1];
  }

  return undefined;
}

// Export stats for debugging/admin dashboard
export const CURRICULUM_STATS = {
  totalLessons: getTotalLessons(),
  totalQuizzes: getTotalQuizzes(),
  totalUnits: UNITS.length,
  totalXP: getTotalXP(),
  totalClasses: CURRICULUM_METADATA.modelClasses.length,
  modelAccuracy: CURRICULUM_METADATA.modelAccuracy,
  version: CURRICULUM_METADATA.version,
  generatedAt: CURRICULUM_METADATA.generatedAt,
};

// Log curriculum info in development
if (process.env.NODE_ENV === 'development') {
  console.log('📚 Curriculum loaded:', CURRICULUM_STATS);
}
