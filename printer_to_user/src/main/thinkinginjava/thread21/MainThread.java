package main.thinkinginjava.thread21;

import org.junit.Test;

/**
 * Created by chenqi on 2017/4/9 0009.
 */
public class MainThread {
    public static void main(String[] args) {

            LiftOff liftOff = new LiftOff();
            liftOff.run();

    }
    @Test
    public void mainThread(){
        new Thread(new LiftOff()).start();
    }
    @Test
    public void moreThread(){
        for (int i = 0; i < 5; i++) {
            new Thread(new LiftOff()).start();
            System.out.println("wationg for LiftOff");
        }

    }
}
