with open(r'c:\Users\sarf0\.antigravity-ide\TrustLens\tailwind.config.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = "sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],"
replacement = """sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        editorial: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],"""

if target in text:
    text = text.replace(target, replacement, 1)
    with open(r'c:\Users\sarf0\.antigravity-ide\TrustLens\tailwind.config.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Updated tailwind.config.js successfully!")
else:
    print("Target not found in tailwind.config.js")

