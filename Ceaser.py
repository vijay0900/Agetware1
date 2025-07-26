def caesar_cipher(text, shift, mode='encode'):
    result = ''
    effective_shift = shift if mode == 'encode' else -shift 
    for char in text:
        if char.isalpha():
            shift_base = ord('A') if char.isupper() else ord('a')
            result += chr((ord(char) - shift_base + effective_shift) % 26 + shift_base)
        else:
            result += char  
    return result


message = "Hello World"
encoded = caesar_cipher(message, 3)
decoded = caesar_cipher(encoded, 3, mode='decode')

print("Encoded:", encoded)
print("Decoded:", decoded)
