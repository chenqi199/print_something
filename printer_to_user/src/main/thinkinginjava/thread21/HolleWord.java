package main.thinkinginjava.thread21;

/**
 * Created by chenqi on 2017/4/9 0009.
 */
public class HolleWord implements Runnable {
    public static void main(String[] args) {
       new Thread(new HolleWord()).start();
    }

    @Override
    public void run() {
        System.out.println("holle word");
    }
}
