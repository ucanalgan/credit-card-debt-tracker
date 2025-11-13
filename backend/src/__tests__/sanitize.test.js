const { escapeHtml, sanitizeObject } = require('../middleware/sanitize');

describe('Input Sanitization', () => {
  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      const maliciousInput = '<script>alert("XSS")</script>';
      const sanitized = escapeHtml(maliciousInput);

      expect(sanitized).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
      expect(sanitized).not.toContain('<script>');
    });

    it('should handle ampersands correctly', () => {
      expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    it('should return non-string values unchanged', () => {
      expect(escapeHtml(123)).toBe(123);
      expect(escapeHtml(null)).toBe(null);
      expect(escapeHtml(undefined)).toBe(undefined);
    });
  });

  describe('sanitizeObject', () => {
    it('should sanitize all string values in an object', () => {
      const input = {
        name: '<script>alert("XSS")</script>',
        description: 'Normal text',
        amount: 100
      };

      const sanitized = sanitizeObject(input);

      expect(sanitized.name).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
      expect(sanitized.description).toBe('Normal text');
      expect(sanitized.amount).toBe(100);
    });

    it('should handle nested objects', () => {
      const input = {
        user: {
          name: '<b>Bold</b>',
          email: 'test@example.com'
        }
      };

      const sanitized = sanitizeObject(input);

      expect(sanitized.user.name).toBe('&lt;b&gt;Bold&lt;&#x2F;b&gt;');
      expect(sanitized.user.email).toBe('test@example.com');
    });

    it('should handle arrays', () => {
      const input = ['<script>alert(1)</script>', 'normal text', 123];
      const sanitized = sanitizeObject(input);

      expect(sanitized[0]).toBe('&lt;script&gt;alert(1)&lt;&#x2F;script&gt;');
      expect(sanitized[1]).toBe('normal text');
      expect(sanitized[2]).toBe(123);
    });

    it('should handle null and undefined', () => {
      expect(sanitizeObject(null)).toBe(null);
      expect(sanitizeObject(undefined)).toBe(undefined);
    });
  });
});
