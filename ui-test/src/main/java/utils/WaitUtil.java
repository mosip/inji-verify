package utils;

import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import base.BasePage;

import java.time.Duration;

public class WaitUtil {
	private static final int TIMEOUT = BasePage.getTimeout();
	private static final int MAX_RETRIES = 2;
	private static final long RETRY_DELAY_MS = 900;

	/**
	 * Waits for element visibility with retry logic to handle transient failures.
	 * Implements robust waiting with StaleElementReferenceException and TimeoutException handling.
	 * 
	 * @param driver the WebDriver instance
	 * @param element the WebElement to wait for
	 */
	public static void waitForVisibility(WebDriver driver, WebElement element) {
		int retries = 0;
		while (retries <= MAX_RETRIES) {
			try {
				WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(TIMEOUT));
				wait.until(ExpectedConditions.refreshed(ExpectedConditions.visibilityOf(element)));
				return;
			} catch (StaleElementReferenceException e) {
				retries++;
				if (retries > MAX_RETRIES) {
					System.out.println("❌ Failed to wait for element visibility after " + (MAX_RETRIES + 1) + " attempts due to stale element.");
					throw e;
				}
				System.out.println("⚠️ Attempt " + retries + ": Stale element while waiting for visibility. Retrying...");
				try {
					Thread.sleep(RETRY_DELAY_MS);
				} catch (InterruptedException ie) {
					Thread.currentThread().interrupt();
					throw new RuntimeException("Thread interrupted while retrying visibility wait", ie);
				}
			} catch (TimeoutException e) {
				retries++;
				if (retries > MAX_RETRIES) {
					System.out.println("❌ Timeout waiting for element visibility after " + (MAX_RETRIES + 1) + " attempts.");
					throw e;
				}
				System.out.println("⏰ Attempt " + retries + ": Timeout waiting for element visibility. Retrying...");
				try {
					Thread.sleep(RETRY_DELAY_MS);
				} catch (InterruptedException ie) {
					Thread.currentThread().interrupt();
					throw new RuntimeException("Thread interrupted while retrying visibility wait", ie);
				}
			}
		}
	}

	/**
	 * Waits for element clickability with retry logic to handle transient failures.
	 * Implements robust waiting with StaleElementReferenceException and TimeoutException handling.
	 * 
	 * @param driver the WebDriver instance
	 * @param element the WebElement to wait for
	 */
	public static void waitForClickability(WebDriver driver, WebElement element) {
		int retries = 0;
		while (retries <= MAX_RETRIES) {
			try {
				WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(TIMEOUT));
				wait.until(ExpectedConditions.refreshed(ExpectedConditions.elementToBeClickable(element)));
				return;
			} catch (StaleElementReferenceException e) {
				retries++;
				if (retries > MAX_RETRIES) {
					System.out.println("❌ Failed to wait for element clickability after " + (MAX_RETRIES + 1) + " attempts due to stale element.");
					throw e;
				}
				System.out.println("⚠️ Attempt " + retries + ": Stale element while waiting for clickability. Retrying...");
				try {
					Thread.sleep(RETRY_DELAY_MS);
				} catch (InterruptedException ie) {
					Thread.currentThread().interrupt();
					throw new RuntimeException("Thread interrupted while retrying clickability wait", ie);
				}
			} catch (TimeoutException e) {
				retries++;
				if (retries > MAX_RETRIES) {
					System.out.println("❌ Timeout waiting for element clickability after " + (MAX_RETRIES + 1) + " attempts.");
					throw e;
				}
				System.out.println("⏰ Attempt " + retries + ": Timeout waiting for element clickability. Retrying...");
				try {
					Thread.sleep(RETRY_DELAY_MS);
				} catch (InterruptedException ie) {
					Thread.currentThread().interrupt();
					throw new RuntimeException("Thread interrupted while retrying clickability wait", ie);
				}
			}
		}
	}

	/**
	 * Waits for element invisibility with retry logic to handle transient failures.
	 * Implements robust waiting with StaleElementReferenceException and TimeoutException handling.
	 * 
	 * @param driver the WebDriver instance
	 * @param element the WebElement to wait for
	 * @return true if element becomes invisible, false on failure after retries
	 */
	public static boolean waitForInvisibility(WebDriver driver, WebElement element) {
		int retries = 0;
		while (retries <= MAX_RETRIES) {
			try {
				WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(TIMEOUT));
				return wait.until(ExpectedConditions.refreshed(ExpectedConditions.invisibilityOf(element)));
			} catch (StaleElementReferenceException e) {
				retries++;
				if (retries > MAX_RETRIES) {
					System.out.println("❌ Failed to wait for element invisibility after " + (MAX_RETRIES + 1) + " attempts due to stale element.");
					return false;
				}
				System.out.println("⚠️ Attempt " + retries + ": Stale element while waiting for invisibility. Retrying...");
				try {
					Thread.sleep(RETRY_DELAY_MS);
				} catch (InterruptedException ie) {
					Thread.currentThread().interrupt();
					return false;
				}
			} catch (TimeoutException e) {
				retries++;
				if (retries > MAX_RETRIES) {
					System.out.println("❌ Timeout waiting for element invisibility after " + (MAX_RETRIES + 1) + " attempts.");
					return false;
				}
				System.out.println("⏰ Attempt " + retries + ": Timeout waiting for element invisibility. Retrying...");
				try {
					Thread.sleep(RETRY_DELAY_MS);
				} catch (InterruptedException ie) {
					Thread.currentThread().interrupt();
					return false;
				}
			}
		}
		return false;
	}
}