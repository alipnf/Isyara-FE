import { Lesson } from '@type/learn';

// Function to get lesson route based on lesson type and completion status
export function getLessonRoute(lesson: Lesson): string {
  if (lesson.locked) {
    return '#'; // No route for locked lessons
  }

  if (lesson.type === 'quiz') {
    return `/quiz?key=${lesson.key}`;
  }

  // For lessons with ranges (e.g., A-E)
  if ('hurufRange' in lesson) {
    return `/lesson?category=huruf&group=${lesson.hurufRange.join(',')}`;
  }

  if ('numberRange' in lesson) {
    return `/lesson?category=angka&group=${lesson.numberRange.join(',')}`;
  }

  if ('wordGroup' in lesson) {
    return `/lesson?category=kata&group=${lesson.wordGroup.join(',')}`;
  }

  return '/lesson';
}
