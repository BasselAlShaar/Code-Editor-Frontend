export const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  csharp: 51,
  php: 68,
};

export const CODE_SNIPPETS = {
  python: `def greet(name):
    print("Hello " + name)

greet("Charbel")`,

  javascript: `function greet(name) {
  console.log("Hello " + name);
}

greet("Taha");`,

  java: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}`,

  php: `<?php
$name = "Chris";
echo $name;
?>`,

  csharp: `using System;

class Program {
  static void Main() {
    Console.WriteLine("Hello World");
  }
}`
};